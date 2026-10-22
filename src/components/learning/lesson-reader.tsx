"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { markLessonSection, saveLessonProgress, toggleSaveLesson } from "@/app/actions";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { Citation } from "@/components/ui/citation";
import { ProgressBar } from "@/components/ui/progress";
import type { Lesson } from "@/content/schema";
import type { QuizQuestion } from "@/content/schema";

export type LessonReaderModel = {
  lessonData: Lesson;
  embeddedQuestions: QuizQuestion[];
  alreadyCompleted: boolean;
};

type Model = LessonReaderModel;

export function LessonReader({ model }: { model: Model }) {
  const { lessonData: lesson, embeddedQuestions, alreadyCompleted } = model;
  const router = useRouter();
  const reduced = useReducedMotion();
  const [seenCount, setSeenCount] = useState(0);
  const [markedDone, setMarkedDone] = useState(Boolean(alreadyCompleted));
  const [saved, setSaved] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [detailOpen, setDetailOpen] = useState<Record<string, boolean>>({});
  // Derived, not stored: the "check open" gate auto-satisfies once every
  // section has been seen on a lesson already marked completed (deep-link
  // friendly). Recomputed on render instead of set in an effect.
  const checkOpen = seenCount === lesson.sections.length && alreadyCompleted;

  function markSeen(sectionId: string, index: number) {
    setSeenCount((c) => Math.max(c, index + 1));
    startTransition(async () => {
      await markLessonSection(lesson.id, sectionId);
    });
  }

  function onComplete() {
    setMarkedDone(true);
    startTransition(async () => {
      await saveLessonProgress(lesson.id, true);
      router.refresh();
    });
  }

  function onSave() {
    startTransition(async () => {
      const result = await toggleSaveLesson(lesson.id);
      const isSaved = result.ok ? Boolean(result.saved) : saved;
      setSaved(isSaved);
      setSavedMessage(isSaved ? "Saved to your lessons." : "Removed from saved lessons.");
      window.setTimeout(() => setSavedMessage(null), 2500);
    });
  }

  const pct = Math.round(((seenCount) / lesson.sections.length) * 100);

  return (
    <article className="prose-readable">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={markedDone ? "positive" : "info"}>{markedDone ? "Completed" : "In progress"}</Badge>
        <span className="text-sm text-mist">Objective: {lesson.objective}</span>
      </div>

      <div className="mt-4">
        <ProgressBar value={pct} max={100} label="sections read" />
      </div>

      <ol className="mt-6 flex flex-col gap-6" aria-label="Lesson sections">
        {lesson.sections.map((section, idx) => (
          <motion.li
            key={section.id}
            data-testid="lesson-section"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: reduced ? 0 : idx * 0.05 }}
            className="rounded-card bg-white p-5 ring-1 ring-forest-100"
          >
            <SectionSeenBridge onSeen={() => markSeen(section.id, idx)} active={seenCount < idx + 1} />
            <h2 className="text-lg font-semibold text-forest">{section.heading}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink">{section.body}</p>
            {section.detail ? (
              <div className="mt-3">
                <button
                  type="button"
                  aria-expanded={Boolean(detailOpen[section.id])}
                  className="text-sm font-medium text-quietblue-600 hover:underline"
                  onClick={() => setDetailOpen((d) => ({ ...d, [section.id]: !d[section.id] }))}
                >
                  {detailOpen[section.id] ? "Hide deeper explanation" : "Show deeper explanation"}
                </button>
                <AnimatePresence initial={false}>
                  {detailOpen[section.id] ? (
                    <motion.div
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 rounded-lg bg-quietblue/40 px-4 py-3 text-sm leading-relaxed text-ink">
                        {section.detail}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}
            {section.example ? (
              <Callout tone="note" title="Everyday example" className="mt-3">
                {section.example}
              </Callout>
            ) : null}
          </motion.li>
        ))}
      </ol>

      {/* Key points */}
      <section aria-labelledby="kp-h" className="mt-8">
        <h2 id="kp-h" className="text-lg font-semibold text-forest">Key points</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {lesson.keyPoints.map((kp, i) => (
            <li key={i} className="flex gap-2 text-[15px] text-ink">
              <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage-strong" />
              {kp}
            </li>
          ))}
        </ul>
      </section>

      {/* Knowledge check */}
      <section aria-labelledby="check-h" className="mt-8">
        <h2 id="check-h" className="text-lg font-semibold text-forest">Check what stuck</h2>
        <p className="mt-1 text-sm text-mist">
          Two quick questions from this lesson.Your answers help the dashboard know what to
          recommend. Nothing more.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {embeddedQuestions.map((q) => (
            <MiniCheck key={q.id} question={q} />
          ))}
        </div>
      </section>

      {/* Actions */}
      <Callout tone="safety" className="mt-8" title="Educational information">
        {lesson.disclaimer}
      </Callout>

      <Card className="mt-6 ring-sage-strong/40">
        <CardBody className="pt-5">
          <h2 className="font-semibold text-forest">Your next step</h2>
          <p className="mt-1 text-sm text-mist">
            Understanding is step one. Pick one concrete move, that&apos;s the whole point here.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ButtonLink href="/scenarios" size="sm">Practise a conversation</ButtonLink>
            <ButtonLink href="/support" size="sm" variant="quiet">See real services</ButtonLink>
            <ButtonLink href={`/quiz/${lesson.moduleId}`} size="sm" variant="quiet">Full module check</ButtonLink>
          </div>
        </CardBody>
      </Card>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button disabled={pending} onClick={onComplete}>
          {markedDone ? "Completed ✓" : "Mark lesson complete"}
        </Button>
        <Button variant="ghost" disabled={pending} onClick={onSave} aria-live="polite">
          {saved ? "In your saved lessons" : "Save for later"}
        </Button>
        {savedMessage ? <span role="status" className="text-sm text-correct">{savedMessage}</span> : null}
        {markedDone ? (
          <ButtonLink href="/learn" variant="secondary" size="md">
            Back to dashboard
          </ButtonLink>
        ) : null}
      </div>

      <p className="mt-6 text-xs text-mist">
        Sources behind this lesson:{" "}
        {lesson.referenceIds.map((r, i) => (
          <span key={r} className="ml-1">
            <Citation id={r} />
            {i < lesson.referenceIds.length - 1 ? "," : ""}
          </span>
        ))}
      </p>
      <div className="sr-only" data-testid="open-check-gate" aria-hidden={!checkOpen}>
        {checkOpen ? "check open" : ""}
      </div>
    </article>
  );
}

/**
 * Fires onSeen once a section has been genuinely visible while scrolled
 * (IntersectionObserver at >55% visibility, distinct entries tracked).
 */
function SectionSeenBridge({ onSeen, active }: { onSeen: () => void; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (!active || fired.current) return;
    const el = ref.current?.parentElement ?? null;
    if (!el || typeof IntersectionObserver === "undefined") {
      onSeen();
      fired.current = true;
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            if (!fired.current) {
              fired.current = true;
              onSeen();
            }
          }
        }
      },
      { threshold: [0.55] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [active, onSeen]);

  return <div ref={ref} aria-hidden="true" className="h-px" />;
}

function MiniCheck({ question }: { question: QuizQuestion }) {
  const [selected, setSelected] = useState<number | null>(null);
  const chosen = selected !== null ? question.options[selected] : null;
  const isCorrect = selected !== null && selected === question.correctIndex;

  return (
    <Card data-testid="knowledge-check">
      <CardBody className="pt-4">
        <fieldset>
          <legend className="text-[15px] font-medium text-forest">{question.prompt}</legend>
          <div className="mt-3 flex flex-col gap-2">
            {question.options.map((opt, i) => {
              const active = selected === i;
              const reveal = selected !== null;
              const correctOne = i === question.correctIndex;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={reveal}
                  onClick={() => setSelected(i)}
                  className={
                    "rounded-lg border px-3.5 py-2.5 text-left text-sm transition" +
                    (reveal
                      ? correctOne
                        ? " border-[#1e7a46] bg-[#e9f6ee]"
                        : active
                          ? " border-[#a3532b] bg-[#f9ede4]"
                          : " border-forest-100 opacity-70"
                      : " border-forest-100 hover:border-forest-500/50")
                  }
                >
                  <span className="flex items-start gap-2">
                    {reveal ? (
                      <span aria-hidden="true" className="mt-0.5 font-bold">
                        {correctOne ? "✓" : active ? "✗" : "·"}
                      </span>
                    ) : null}
                    <span>{opt.text}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
        {chosen ? (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            <p className="text-sm font-medium text-forest">
              {isCorrect ? "Correct, " : "Not quite, "}
              {question.principle}
            </p>
            <p className="mt-1 text-sm text-mist">Your pick: {chosen.feedback}</p>
            <p className="mt-1 text-sm text-mist">
              {question.options[question.correctIndex].feedback}
            </p>
            <p className="mt-2 flex flex-wrap gap-1 text-xs text-mist">
              Sources:
              {question.referenceIds.map((r) => (
                <Citation key={r} id={r} />
              ))}
            </p>
          </motion.div>
        ) : null}
      </CardBody>
    </Card>
  );
}
