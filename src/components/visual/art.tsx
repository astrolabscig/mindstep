import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Professional illustration system (unDraw).
 *
 * unDraw's open licence allows commercial and personal use without
 * attribution. The SVG source files are downloaded from undraw.co, recoloured
 * to the MINDSTEP palette at authoring time, and committed in
 * `public/art/<name>.svg` so the app never depends on a third-party CDN at
 * runtime. A missing file renders nothing, never a broken image or placeholder
 * doodle.
 *
 * Source and alt-text register: docs/illustration-map.md
 */

export type ArtName =
  | "overwhelmed"
  | "low-mood"
  | "worry-ideas"
  | "sleep-night"
  | "friends-talking"
  | "community"
  | "chat-bubbles"
  | "breathing-woman"
  | "take-a-break"
  | "real-people"
  | "you-matter"
  | "learning"
  | "progress-path"
  | "welcome"
  | "role-play"
  | "support-connection"
  | "research-notes"
  | "plan-steps"
  | "safety-net"
  | "hero-calm"
  | "loop";

type ArtEntry = {
  aspect: string;
  alt: string;
};

const ART: Record<ArtName, ArtEntry> = {
  "overwhelmed": { aspect: "aspect-[3/2]", alt: "Illustration: a person sitting calmly, breathing through overwhelm" },
  "low-mood": { aspect: "aspect-[3/2]", alt: "Illustration: a person beside a large low-mood face, feeling flat" },
  "worry-ideas": { aspect: "aspect-[3/2]", alt: "Illustration: a person sorting thoughts into notes, turning worry into a plan" },
  "sleep-night": { aspect: "aspect-[3/2]", alt: "Illustration: a person at a window at night, winding down to rest" },
  "friends-talking": { aspect: "aspect-[3/2]", alt: "Illustration: three people talking around a table" },
  "community": { aspect: "aspect-[3/2]", alt: "Illustration: three people connected by an online conversation" },
  "chat-bubbles": { aspect: "aspect-[3/2]", alt: "Illustration: a person getting support through a phone chat" },
  "breathing-woman": { aspect: "aspect-[3/2]", alt: "Illustration: a person sitting cross-legged, practising mindfulness" },
  "take-a-break": { aspect: "aspect-[3/2]", alt: "Illustration: a person resting in a hammock, taking a break" },
  "real-people": { aspect: "aspect-[3/2]", alt: "Illustration: two people standing together under a tree" },
  "you-matter": { aspect: "aspect-[3/2]", alt: "Illustration: a person looking at a phone, feeling proud" },
  "learning": { aspect: "aspect-[3/2]", alt: "Illustration: a person with books and a lightbulb, learning" },
  "progress-path": { aspect: "aspect-[3/2]", alt: "Illustration: a person walking a clear path of steps" },
  "welcome": { aspect: "aspect-[3/2]", alt: "Illustration: two people with a large question mark, choosing what to answer" },
  "role-play": { aspect: "aspect-[3/2]", alt: "Illustration: two people talking on a bench, practising a conversation" },
  "support-connection": { aspect: "aspect-[3/2]", alt: "Illustration: two people holding a phone with a heart, finding support together" },
  "research-notes": { aspect: "aspect-[3/2]", alt: "Illustration: a person checking documents with a magnifying glass" },
  "plan-steps": { aspect: "aspect-[3/2]", alt: "Illustration: a person with a clipboard, planning small steps" },
  "safety-net": { aspect: "aspect-[3/2]", alt: "Illustration: a person with a secure folder, representing safety and privacy" },
  "hero-calm": { aspect: "aspect-[3/2]", alt: "Illustration: a person holding a sun, representing a hopeful next step" },
  "loop": { aspect: "aspect-[3/2]", alt: "Illustration: a person moving through a short checklist of steps" },
};

/** Module → its professional illustration. */
export const moduleArt: Record<string, ArtName> = {
  "mental-health-fundamentals": "learning",
  "stress-coping": "breathing-woman",
  "understanding-anxiety": "overwhelmed",
  "understanding-depression": "low-mood",
  "myths-stigma": "real-people",
  "supportive-communication": "friends-talking",
  "when-to-seek-help": "you-matter",
  "navigating-services-ghana": "chat-bubbles",
};

export function artForModule(moduleId: string): ArtName | null {
  return moduleArt[moduleId] ?? null;
}

function artSrc(name: ArtName): string {
  return `/art/${name}.svg`;
}

export function hasArt(): boolean {
  return true;
}

export function Art({
  name,
  className,
  imgClassName,
  priority,
  alt,
}: {
  name: ArtName;
  className?: string;
  /** Extra classes for the rendered image, e.g. object-cover for a thumbnail. */
  imgClassName?: string;
  priority?: boolean;
  /** Override the register alt text, e.g. pass "" for a decorative thumbnail. */
  alt?: string;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden", ART[name].aspect, className)}>
      <Image
        src={artSrc(name)}
        alt={alt ?? ART[name].alt}
        fill
        sizes="(max-width: 640px) 90vw, 360px"
        priority={priority}
        className={cn("object-contain", imgClassName)}
      />
    </div>
  );
}

/** Rotating professional art for lesson point cards. */
export const pointArt: ArtName[] = [
  "learning",
  "friends-talking",
  "progress-path",
  "low-mood",
  "breathing-woman",
  "chat-bubbles",
  "overwhelmed",
  "real-people",
  "you-matter",
  "take-a-break",
];
