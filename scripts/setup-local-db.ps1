[CmdletBinding()]
param(
    [string]$AdminUser = "postgres",
    [string]$PgHost = "localhost",
    [int]$Port = 5432,
    [string]$AppUser = "skillbridge_app",
    [string]$DatabaseName = "skillbridge",
    [string]$ShadowDatabaseName = "skillbridge_shadow"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $projectRoot ".env"
$psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

if (-not (Test-Path -LiteralPath $psql)) {
    throw "psql was not found at $psql"
}

if (Test-Path -LiteralPath $envFile) {
    throw ".env already exists. Aborting to avoid overwriting it."
}

foreach ($identifier in @($AppUser, $DatabaseName, $ShadowDatabaseName)) {
    if ($identifier -notmatch '^[a-z_][a-z0-9_]*$') {
        throw "Invalid PostgreSQL identifier: $identifier"
    }
}

$ignoreCheck = & git -C $projectRoot check-ignore -v ".env" 2>$null
if ($LASTEXITCODE -ne 0) {
    throw "Git does not ignore .env. Aborting before writing credentials."
}

$enteredAdminUser = Read-Host "PostgreSQL administrator username [$AdminUser]"
if (-not [string]::IsNullOrWhiteSpace($enteredAdminUser)) {
    $AdminUser = $enteredAdminUser.Trim()
}

$adminSecure = Read-Host "Enter the PostgreSQL administrator password (input hidden)" -AsSecureString
$adminBstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminSecure)

try {
    $adminPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($adminBstr)
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($adminBstr)
}

$passwordBytes = New-Object byte[] 32
$random = [System.Security.Cryptography.RandomNumberGenerator]::Create()

try {
    $random.GetBytes($passwordBytes)
}
finally {
    $random.Dispose()
}

$appPassword = [Convert]::ToBase64String($passwordBytes).Replace("+", "-").Replace("/", "_").TrimEnd([char]"=")

$env:PGPASSWORD = $adminPassword

try {
    $adminCheck = & $psql -X -w -h $PgHost -p $Port -U $AdminUser -d postgres -v ON_ERROR_STOP=1 -tAc "SELECT current_user;"
    if ($LASTEXITCODE -ne 0) {
        throw "Could not connect as the PostgreSQL administrator. No changes were made."
    }

    $preflightSql = @"
SELECT 'role:' || rolname FROM pg_roles WHERE rolname = '$AppUser'
UNION ALL
SELECT 'database:' || datname FROM pg_database WHERE datname IN ('$DatabaseName', '$ShadowDatabaseName');
"@

    $existingObjects = @(& $psql -X -w -h $PgHost -p $Port -U $AdminUser -d postgres -v ON_ERROR_STOP=1 -tAc $preflightSql | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    if ($LASTEXITCODE -ne 0) {
        throw "Could not check for existing SkillBridge database objects. No changes were made."
    }

    if ($existingObjects.Count -gt 0) {
        throw "Aborting: existing SkillBridge objects were found: $($existingObjects -join ', ')"
    }

    $setupSql = @"
CREATE ROLE $AppUser WITH LOGIN PASSWORD '$appPassword' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS;
CREATE DATABASE $DatabaseName OWNER $AppUser;
CREATE DATABASE $ShadowDatabaseName OWNER $AppUser;
REVOKE ALL ON DATABASE $DatabaseName FROM PUBLIC;
REVOKE ALL ON DATABASE $ShadowDatabaseName FROM PUBLIC;
GRANT CONNECT ON DATABASE $DatabaseName TO $AppUser;
GRANT CONNECT ON DATABASE $ShadowDatabaseName TO $AppUser;
"@

    $setupSql | & $psql -X -w -h $PgHost -p $Port -U $AdminUser -d postgres -v ON_ERROR_STOP=1
    if ($LASTEXITCODE -ne 0) {
        throw "Database setup failed. Inspect the PostgreSQL error above; no existing databases were modified."
    }

    $env:PGPASSWORD = $appPassword

    $appCheck = & $psql -X -w -h $PgHost -p $Port -U $AppUser -d $DatabaseName -v ON_ERROR_STOP=1 -tAc "SELECT current_database() || '|' || current_user;"
    if ($LASTEXITCODE -ne 0) {
        throw "The application user could not connect to $DatabaseName."
    }

    $shadowCheck = & $psql -X -w -h $PgHost -p $Port -U $AppUser -d $ShadowDatabaseName -v ON_ERROR_STOP=1 -tAc "SELECT current_database() || '|' || current_user;"
    if ($LASTEXITCODE -ne 0) {
        throw "The application user could not connect to $ShadowDatabaseName."
    }

    $roleFlags = & $psql -X -w -h $PgHost -p $Port -U $AppUser -d $DatabaseName -v ON_ERROR_STOP=1 -tAc "SELECT rolsuper::text || '|' || rolcreatedb::text || '|' || rolcreaterole::text || '|' || rolreplication::text || '|' || rolbypassrls::text FROM pg_roles WHERE rolname = current_user;"
    if ($LASTEXITCODE -ne 0 -or $roleFlags -ne "false|false|false|false|false") {
        throw "The application role privileges were not configured as expected."
    }

    $databaseUrl = "postgresql://${AppUser}:${appPassword}@${PgHost}:${Port}/${DatabaseName}?schema=public"
    $shadowDatabaseUrl = "postgresql://${AppUser}:${appPassword}@${PgHost}:${Port}/${ShadowDatabaseName}?schema=public"
    $envContent = "DATABASE_URL=`"$databaseUrl`"`r`nSHADOW_DATABASE_URL=`"$shadowDatabaseUrl`"`r`n"

    [System.IO.File]::WriteAllText($envFile, $envContent, [System.Text.Encoding]::ASCII)

    $envIgnoreCheck = & git -C $projectRoot check-ignore -v ".env" 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw ".env was created but Git does not ignore it. Remove it before committing anything."
    }

    Write-Host ""
    Write-Host "Local PostgreSQL setup verified."
    Write-Host "Application database: $DatabaseName"
    Write-Host "Shadow database: $ShadowDatabaseName"
    Write-Host "Application role: $AppUser (non-superuser, no CREATEDB, no CREATEROLE, no replication, no BYPASSRLS)"
    Write-Host ".env created and confirmed ignored by Git."
    Write-Host "No passwords were printed."
}
finally {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}
