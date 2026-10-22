"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { markLessonSection, saveLessonProgress } from "@/app/actions";
import { buildPoints, splitSentences } from "@/lib/domain/points";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { Art, pointArt } from "@/components/visual/art";import { SpeakButton } from "@/components/ui/speak-button";
import type { LessonReaderModel } from "./lesson-reader";

/**
 * Focus mode. Micro-learning deck. ONE idea per screen: a bold attention
 * line, "more" behind one tap (progressive disclosure), a uniform
 * illustration, and natural voice via the device's own speech engine.
 * The closing "in one screen" card carries hand-authored key points.
 */

const NAV_KEY_DEBOUNCE_MS = 250;

export function LessonFocus({
  model,
  quitToFullView,
  quizHref,
}: {
  model: LessonReaderModel;
  quitToFullView: () => void;
  quizHref: string;
}) {
  const { lessonData: lesson, alreadyCompleted } = model;
  const router = useRouter();
  const reduced = useReducedMotion();
  const points = useMemo(() => buildPoints(lesson), [lesson]);

  const [index, setIndex] = useState(0);
  const [more, setMore] = useState(false);
  const [markedDone, setMarkedDone] = useState(Boolean(alreadyCompleted));
  const [pending, startTransition] = useTransition();
  const [lastKeyAt, setLastKeyAt] = useState(0);

  const point = points[Math.min(index, points.length - 1)];
  const isLast = index === points.length - 1;

  // Keyboard navigation: ← / → / Enter, debounced so page-down doesn't skip.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Enter") return;
      const now = Date.now();
      if (now - lastKeyAt < NAV_KEY_DEBOUNCE_MS) return;
      setLastKeyAt(now);
      if (e.key === "ArrowRight" || (e.key === "Enter" && !more && !isLast)) {
        goTo(index + 1);
      } else if (e.key === "ArrowLeft" && index > 0) {
        goTo(index - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, more, isLast]);

  function goTo(next: number) {
    const bounded = Math.max(0, Math.min(next, points.length - 1));
    setMore(false);
    setIndex(bounded);
    const target = points[bounded];
    if (target.sectionId && !reduced) {
      // save furthest section seen (also validates the id server-side)
      startTransition(async () => {
        await markLessonSection(lesson.id, target.sectionId);
      });
    }
  }

  const spokenText = [point.key, point.rest, point.example ? `Example. ${point.example}` : ""]
    .filter(Boolean)
    .join(" ");
  const voiceSrc = `/voice/${lesson.id}/${index}.mp3`;

  // Concise by rule: at most two sentences expand inline on the card; the
  // remainder directs to the full-article view instead of a wall of text.
  const restSentences = point.rest ? splitSentences(point.rest) : [];
  const restPreview = restSentences.slice(0, 2).join(" ");
  const hiddenRestExists = restSentences.length > 2;

  function markComplete() {
    setMarkedDone(true);
    startTransition(async () => {
      await saveLessonProgress(lesson.id, true);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* deck header: position + dots */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-quietblue-600">
          Point {index + 1} of {points.length}
        </p>
        <button
          type="button"
          onClick={quitToFullView}
          className="text-xs text-mist underline hover:text-forest"
        >
          Prefer the full article?
        </button>
      </div>
      <div className="mt-2 flex items-center gap-1.5" role="img" aria-label={`Progress: point ${index + 1} of ${points.length}`}>
        {points.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to point ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === index
                ? "w-6 bg-forest"
                : i < index
                  ? "w-2 bg-sage-strong"
                  : "w-2 bg-forest-100 hover:bg-forest-500/50"
            }`}
          />
        ))}
      </div>

      {/* the card */}
      <AnimatePresence mode="wait">
        <motion.article
          key={index}
          initial={reduced ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="mt-4 rounded-card bg-white p-6 ring-1 ring-forest-100 shadow-[0_1px_2px_rgba(14,41,40,0.06)] sm:p-8"
          data-testid="focus-point"
        >
          <div className="mx-auto grid gap-6 sm:grid-cols-[1fr_120px] sm:items-start">
            <div className="min-w-0">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-mist">
                {point.heading}
              </h2>
              <p className="mt-3 text-balance text-[22px] font-semibold leading-snug text-forest sm:text-2xl" data-testid="focus-key">
                {point.key}
              </p>
            </div>
            {point.isSummary ? (
              <Art name="progress-path" className="hidden w-[130px] max-w-[130px] shrink-0 sm:block" />
            ) : (
              <Art name={pointArt[index % pointArt.length]} className="hidden w-[130px] shrink-0 sm:block" />
            )}
          </div>

          {/* progressive disclosure: two short sentences here, everything
              else lives in the full-article view, never a wall on the card */}
          {!point.isSummary && point.rest ? (
            <div className="mt-5">
              {more ? (
                <p className="text-[15px] leading-relaxed text-ink/85">
                  {restPreview}
                  {hiddenRestExists ? (
                    <button
                      type="button"
                      onClick={quitToFullView}
                      className="ml-1 text-sm font-medium text-quietblue-600 underline underline-offset-2 hover:text-forest"
                    >
                      Read the rest in the full article →
                    </button>
                  ) : null}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setMore(true)}
                  className="min-h-11 rounded-lg px-1 text-sm font-medium text-quietblue-600 underline decoration-quietblue-600/40 underline-offset-2 hover:text-forest"
                >
                  More on this →
                </button>
              )}
            </div>
          ) : null}

          {more && point.detail ? (
            <div className="mt-3">
              <details className="rounded-lg bg-canvas px-3 py-2 text-sm text-ink/80">
                <summary className="cursor-pointer text-forest">Deeper background</summary>
                <p className="mt-1 leading-relaxed">{point.detail}</p>
              </details>
            </div>
          ) : null}

          {point.example ? (
            <Callout tone="note" title="Everyday example" className="mt-5">
              {point.example}
            </Callout>
          ) : null}

          {point.isSummary && point.bullets ? (
            <motion.ul
              className="mt-5 flex flex-col gap-3"
              data-testid="summary-bullets"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            >
              {point.bullets.map((b, bi) => (
                <motion.li
                  key={bi}
                  variants={
                    reduced
                      ? { hidden: {}, show: {} }
                      : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }
                  }
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex items-start gap-3"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full bg-sage/50 text-xs font-bold text-forest"
                  >
                    {bi + 1}
                  </span>
                  <span className="text-[15px] font-medium leading-snug text-forest">{b}</span>
                </motion.li>
              ))}
            </motion.ul>
          ) : null}

          {point.disclaimer ? (
            <p className="mt-4 rounded-lg bg-forest-100/60 px-3 py-2 text-xs leading-relaxed text-mist">
              {point.disclaimer}
            </p>
          ) : null}

          {/* controls */}
          <div className="mt-7 flex items-center justify-between gap-3 border-t border-forest-100 pt-5">
            <div className="flex items-center gap-2">
              {index > 0 ? (
                <Button variant="ghost" size="sm" onClick={() => goTo(index - 1)}>
                  ← Back
                </Button>
              ) : (
                <span />
              )}
            </div>
            <div className="flex items-center gap-2">
              <SpeakButton text={spokenText} src={voiceSrc} />
              {!isLast ? (
                <Button onClick={() => goTo(index + 1)} disabled={pending}>
                  Continue →
                </Button>
              ) : null}
            </div>
          </div>
        </motion.article>
      </AnimatePresence>

      {/* closing card actions */}
      {isLast ? (
        <div className="relative mt-5 flex flex-col gap-3 rounded-card bg-white p-5 ring-1 ring-forest-100">
          <div className="flex flex-wrap items-center gap-2">
            {markedDone ? (
              <Badge tone="positive">Lesson completed</Badge>
            ) : (
              <Button onClick={markComplete} disabled={pending}>
                Mark lesson complete
              </Button>
            )}
            <ButtonLink href={quizHref} variant="secondary" size="sm">
              Take the module knowledge check →
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </div>
  );
}
