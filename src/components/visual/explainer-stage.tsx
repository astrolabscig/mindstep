"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Art, type ArtName } from "./art";
import { type ExplainName } from "./explainers";

/**
 * Stage renderer for the illustrated explainers.
 *
 * Every frame is a professional unDraw illustration from `public/art`; we do
 * not draw our own people, circles, or balls in CSS. The stage is decorative
 * (aria-hidden), while the captions and voice carry the meaning. Steps
 * cross-fade, and `prefers-reduced-motion` leaves the first frame static.
 */

const SCENE_ART: Record<ExplainName, ArtName[]> = {
  breathe: ["breathing-woman", "breathing-woman"],
  overwhelm: ["overwhelmed", "worry-ideas", "take-a-break"],
  "breath-lows": ["low-mood", "progress-path"],
  "worry-locate": ["worry-ideas", "breathing-woman", "breathing-woman"],
  conversation: ["friends-talking", "role-play", "friends-talking"],
  "young-person": ["low-mood", "you-matter", "hero-calm"],
  loop: ["loop", "role-play", "plan-steps"],
};

export function ExplainerStage({
  name,
  step,
  className,
}: {
  name: ExplainName;
  /** Current stage index; 0 = initial/neutral frame. */
  step: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const frames = SCENE_ART[name];
  const frame = frames[Math.min(step, frames.length - 1)] ?? frames[0];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#e4f3ee] via-[#f1f9f5] to-[#f8fcfa] ring-1 ring-[#dcebe8]",
        className,
      )}
      data-testid={`explain-scene-${name}`}
      data-step={step}
      data-art={frame}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={`${name}-${step}`}
          initial={reduced ? false : { opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.45, ease: "easeOut" }}
          className="absolute inset-0 p-2"
        >
          <Art
            name={frame}
            alt=""
            className="h-full w-full"
            imgClassName="object-contain"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
