"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navLinkBase =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-control px-3 py-2 text-sm font-medium transition-colors";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  disabled?: boolean;
};

export function NavLink({ href, children, disabled = false }: NavLinkProps) {
  const pathname = usePathname();

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        title="Available in a future phase"
        className={cn(navLinkBase, "cursor-not-allowed text-subtle")}
      >
        {children}
        <Badge
          variant="neutral"
          className="px-1.5 py-0 text-[10px] uppercase tracking-wide"
        >
          Soon
        </Badge>
      </span>
    );
  }

  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        navLinkBase,
        isActive
          ? "bg-accent-soft text-brand"
          : "text-muted hover:bg-surface-muted hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
