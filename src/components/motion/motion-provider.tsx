"use client";

import { MotionConfig } from "framer-motion";
import { DUR, EASE_OUT } from "@/lib/motion";

/**
 * Global motion policy: respect the OS reduced-motion preference everywhere
 * (transform/layout animations drop out, colour/opacity remain), and give all
 * animations one default duration/easing so nothing is ad-hoc.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: DUR.base, ease: EASE_OUT }}
    >
      {children}
    </MotionConfig>
  );
}
