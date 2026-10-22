import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "h-11 w-full rounded-control border border-line bg-surface px-3.5 text-sm text-ink shadow-subtle transition-colors placeholder:text-subtle hover:border-muted/50 focus:border-accent disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
}
