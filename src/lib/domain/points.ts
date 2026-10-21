import type { Lesson } from "@/content/schema";

/**
 * Point-by-point content delivery (micro-learning cards).
 *
 * Evidence basis (see docs/research.md "Delivery-mode research"): micro-learning
 * and progressive disclosure raise learner satisfaction and knowledge while
 * reducing cognitive load. Careless prose trimming can distort meaning, so this
 * module is conservative by rule:
 *  - the KEY line is always the first complete sentence, never rewritten;
 *  - the remainder is available one tap away ("more"), abridged nothing;
 *  - a hand-authored `keyPoints` summary (already in content) anchors the
 *    closing card. Machine trimming is never the last word.
 */

export type LessonPoint = {
  /** Owning section id; "" for the synthetic closing summary card. */
  sectionId: string;
  heading: string;
  /** First sentence, verbatim (sentence-boundary ellipsis if over the cap). */
  key: string;
  /** The rest of the section. Disclosed via "more"; "" when already short. */
  rest: string;
  /** Optional deeper explanation from the content author. */
  detail?: string;
  /** Optional everyday example from the content author. */
  example?: string;
  /** True for the closing "in one screen" card. */
  isSummary?: boolean;
  /** Hand-authored key points; present only on the summary card. */
  bullets?: string[];
  /** The lesson's educational disclaimer; present only on the summary card. */
  disclaimer?: string;
};

const KEY_LINE_CAP = 170;

/** Split prose into sentences without regex lookbehind (Safari-safe). */
export function splitSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+["')\]]*(\s|$)/g);
  if (!matches) {
    const single = text.trim();
    return single ? [single] : [];
  }
  return matches.map((s) => s.trim()).filter(Boolean);
}

/**
 * The attention line: first sentence, verbatim. Long first sentences are cut
 * at a word boundary with an ellipsis, the full text stays available.
 */
export function keyLineFrom(text: string, max = KEY_LINE_CAP): string {
  const first = splitSentences(text)[0] ?? text.trim();
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  const atWord = cut.lastIndexOf(" ");
  return (atWord > max * 0.6 ? cut.slice(0, atWord) : cut).trimEnd() + "…";
}

/** One micro-card per lesson section, plus the closing summary card. */
export function buildPoints(lesson: Lesson): LessonPoint[] {
  const cards: LessonPoint[] = lesson.sections.map((section) => {
    const sentences = splitSentences(section.body);
    const key = keyLineFrom(section.body);
    const rest = sentences.slice(1).join(" ");
    return {
      sectionId: section.id,
      heading: section.heading,
      key,
      rest: rest.length >= 20 ? rest : "",
      detail: section.detail,
      example: section.example,
    };
  });

  cards.push({
    sectionId: "",
    heading: "In one screen",
    key: "Three things to take with you:",
    rest: "",
    isSummary: true,
    bullets: [...lesson.keyPoints],
    disclaimer: lesson.disclaimer,
  });

  return cards;
}
