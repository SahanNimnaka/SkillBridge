import Link from "next/link";

import { Container } from "@/components/ui/container";
import { NavLink } from "@/components/ui/nav-link";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/opportunities", label: "Opportunities", disabled: true },
  { href: "/dashboard", label: "Dashboard", disabled: true },
  { href: "/profile", label: "Profile", disabled: true },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <Container className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <Link
          href="/"
          aria-label="SkillBridge home"
          className="inline-flex w-fit items-center gap-2.5 rounded-control"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-control bg-brand text-sm font-bold tracking-tight text-white"
          >
            SB
          </span>
          <span className="text-base font-semibold tracking-tight text-brand">
            SkillBridge
          </span>
        </Link>

        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-1 md:justify-end">
            {navigation.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} disabled={item.disabled}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
