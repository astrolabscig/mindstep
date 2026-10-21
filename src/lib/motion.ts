/**
 * Motion tokens, one source of truth for timing/easing.
 * Direction: calm, editorial, "quiet UI with one confident signature".
 * Motion explains state change (nav position, explainer steps) and never
 * decorates. Bouncy springs are reserved for the nav pill only.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DUR = {
  instant: 0.12,
  fast: 0.2,
  base: 0.32,
  slow: 0.5,
} as const;

export const SPRING = {
  snappy: { type: "spring", stiffness: 500, damping: 35, mass: 0.8 },
  smooth: { type: "spring", stiffness: 260, damping: 30 },
} as const;

export const STAGGER = { tight: 0.04, base: 0.07, loose: 0.12 } as const;
