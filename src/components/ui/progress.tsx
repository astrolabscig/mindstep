"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Art, type ArtName } from "@/components/visual/art";

/**
 * Accessible progress bar. Communicates the percentage via text so the
 * information never depends on colour/width alone (WCAG 2.2).
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  className,
}: {
  value: number;
  max?: number;
  label: string;
  className?: string;
}) {
  const pct = Math.round((value / max) * 100);
  const reduced = useReducedMotion();
  return (
    <div className={cn("w-full", className)}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={pct}
        aria-label={label}
        className="h-1.5 w-full overflow-hidden rounded-full bg-forest-100"
      >
        {reduced ? (
          <div className="h-full rounded-full bg-sage-strong" style={{ width: `${pct}%` }} data-testid="progress-fill" />
        ) : (
          <motion.div
            className="h-full rounded-full bg-sage-strong"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            data-testid="progress-fill"
          />
        )}
      </div>
      <span className="mt-1 block text-xs text-mist">
        {pct}%, {label}
      </span>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-card bg-forest-100/70", className)} />;
}

export function EmptyState({
  title,
  description,
  action,
  art,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  art?: ArtName;
}) {
  return (
    <div className="rounded-card bg-white/70 px-6 py-10 text-center ring-1 ring-dashed ring-forest-100">
      {art ? <Art name={art} alt="" className="mx-auto mb-4 max-w-[160px]" /> : null}
      <h3 className="text-base font-semibold text-forest">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-mist">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
