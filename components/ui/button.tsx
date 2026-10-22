import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control border border-transparent font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50";

const buttonVariants = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "bg-accent text-white hover:bg-accent-hover",
  outline:
    "border-line bg-surface text-ink hover:border-accent/40 hover:bg-accent-soft",
};

const buttonSizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function getButtonClassName({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleOptions;

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={getButtonClassName({ variant, size, className })}
      {...props}
    />
  );
}
