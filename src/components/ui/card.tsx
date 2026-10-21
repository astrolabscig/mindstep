import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card bg-white ring-1 ring-hairline shadow-flat",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-5 pb-2", className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}

export function CardTitle({ className, children, as: Tag = "h3" }: { className?: string; children: ReactNode; as?: "h2" | "h3" | "h4" }) {
  return <Tag className={cn("text-lg font-semibold text-forest", className)}>{children}</Tag>;
}

export function CardText({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("prose-readable text-[15px] leading-relaxed text-mist", className)}>{children}</p>;
}
