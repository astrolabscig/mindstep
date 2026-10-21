/**
 * Motion explainers. Animated, green-palette concept scenes with voice.
 *
 * Visual safety rules (same bar as the rest of the app):
 *  - pure CSS keyframe + transition animation only (no rAF loops);
 *  - every animation part has a `prefers-reduced-motion` static frame;
 *  - everything decorative is aria-hidden; the *caption text* is the
 *    accessible content and is what a screen reader reads;
 *  - the voice is the bundled offline Piper MP3 (server fallback TTS if a
 *    file is missing), never a cloud service.
 */
export type ExplainName =
  | "breathe"
  | "overwhelm"
  | "breath-lows"
  | "worry-locate"
  | "conversation"
  | "young-person"
  | "loop";

export type ExplainStep = {
  /** What the caption says while this stage is on screen. */
  caption: string;
};

export type MotionSpec = {
  /** Voice-over script, spoken by the bundled MP3 (server TTS fallback). */
  script: string;
  /** How many stages the scene has. */
  steps: ExplainStep[];
};

export const MOTION: Record<ExplainName, MotionSpec> = {
  breathe: {
    script:
      "Your body listens to your breath. Breathe out slowly... longer than you breathe in. That slow exhale tells your heart: it's settling now. Nothing else needed.",
    steps: [{ caption: "In..." }, { caption: "...and out, longer." }],
  },
  overwhelm: {
    script:
      "When a worry starts to loop, write it down... once. Getting it on paper takes it out of your head. Paper doesn't argue at one in the morning... and a worry you've written down is a task, not a siren. That's the whole trick.",
    steps: [
      { caption: "Everything loops in your head at once." },
      { caption: "Write the worry down. Once." },
      { caption: "Out of your head. That's already lighter." },
    ],
  },
  "breath-lows": {
    script:
      "When everything feels flat, take the smallest step outside. Five minutes of air and light... it won't fix everything, and it doesn't have to. Motion first... mood follows.",
    steps: [
      { caption: "Flat days shrink the world." },
      { caption: "Five minutes outside. That's all." },
    ],
  },
  "worry-locate": {
    script:
      "Racing thoughts aren't a character flaw. They're a location problem. Your attention is somewhere you didn't send it. Name where it drifted... and gently bring it back. As many times as it takes. That's focus, and it's yours.",
    steps: [
      { caption: "Your attention drifted somewhere you didn't send it." },
      { caption: "Notice it. No scolding." },
      { caption: "Bring it back, as many times as it takes." },
    ],
  },
  conversation: {
    script:
      "Words won't be perfect. They don't need to be. Side by side, it's easier to say what's hard. How are you, really... and then just listen. Nods help. That sounds hard helps. Advice can wait.",
    steps: [
      { caption: "Side by side beats face to face." },
      { caption: "Ask: how are you, really?" },
      { caption: "Then listen more than you fix." },
    ],
  },
  "young-person": {
    script:
      "You don't have to have it together today. Honestly, nobody your age does. Getting through the next hour is enough. Take a breath... That's not doing nothing, that's showing up for yourself.",
    steps: [
      { caption: "The day feels heavier than it is." },
      { caption: "You don't have to carry it all today." },
      { caption: "The next hour. That's the job." },
    ],
  },
  loop: {
    script:
      "Understand one thing about your mind. Practise it... in our safe scenarios. Then take one real step, a call... a visit... or just a plan. That's the loop. Three moves... that change how the day goes.",
    steps: [
      { caption: "Understand one clear idea about your mind." },
      { caption: "Practise the words in a safe conversation." },
      { caption: "Take one next step: a free call, or a plan." },
    ],
  },
};

/** MP3 path for a motion explainer's voice-over. */
export function motionVoicePath(name: ExplainName): string {
  return `/voice/motion/${name}.mp3`;
}
