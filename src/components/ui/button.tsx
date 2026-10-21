import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[color,background-color,box-shadow,scale,transform] duration-150 active:scale-[0.985] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-quietblue-600 disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "bg-forest text-sage hover:bg-forest-700 active:bg-forest-900",
  secondary: "bg-sage text-forest-900 hover:bg-sage-strong active:bg-sage",
  ghost: "bg-transparent text-forest hover:bg-forest-100",
  danger: "bg-[#a3532b] text-white hover:bg-[#8a4522]",
  quiet: "bg-white text-forest ring-1 ring-forest-100 hover:ring-forest-500 hover:bg-quietblue/40",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3.5 text-sm",
  md: "min-h-11 px-5 text-[15px]",
  lg: "min-h-12 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: Size; href: string; children: ReactNode }) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
