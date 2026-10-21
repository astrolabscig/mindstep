"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DUR, EASE_OUT } from "@/lib/motion";

/**
 * Section-level scroll reveal. Use on groups and headings, not on every
 * card in a grid, which turns the page into an opacity assembly line.
 *
 * With reduced motion (or before hydration) the children render statically
 * at full opacity: the content never depends on JavaScript or animation.
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: DUR.slow, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
