"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitQuizAttempt } from "@/app/actions";
import { shuffleQuestions, evaluateAnswer } from "@/lib/domain/quiz";
import type { QuizQuestion } from "@/content/schema";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Callout } from "@/components/ui/callout";
import { Citation } from "@/components/ui/citation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ServerResult = {
  score: { percentage: number; correct: number; total: number; band: string };
  answerResults: { questionId: string; correct: boolean; correctAnswer: number }[];
};

export function QuizRunner({
  questions,
  moduleTitle,
  moduleSlug,
}: {
  questions: QuizQuestion[];
  moduleTitle: string;
  moduleSlug: string;
}) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [attempt, setAttempt] = useState(0);
  const ordered = useMemo(() => shuffleQuestions(questions, `${moduleSlug}-${attempt}`), [questions, moduleSlug, attempt]);

  const [index, setIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<ServerResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const question = ordered[index];
  const progress = index + (revealed[question?.id ?? ""] ? 1 : 0);

  if (result) {
    const missedIds = result.answerResults.filter((r) => !r.correct).map((r) => r.questionId);
    const missed = ordered.filter((q) => missedIds.includes(q.id));
    return (
      <div className="flex flex-col gap-6" data-testid="quiz-result" role="status" aria-live="polite">
        <Card className="ring-sage-strong/50">
          <CardBody className="pt-6 text-center">
            <p className="text-5xl font-bold text-forest" data-testid="quiz-score">
              {result.score.percentage}%
            </p>
            <p className="mt-1 text-sm text-mist">
              {result.score.correct} of {result.score.total} correct · band: {result.score.band}
            </p>
            <p className="mt-3 text-xs text-mist">
              This is an educational knowledge indicator only, it is not a clinical score,
              cannot identify any condition, and has no bearing on anyone&apos;s health status.
            </p>
          </CardBody>
        </Card>

        {missed.length > 0 ? (
          <section aria-labelledby="missed-h">
            <h2 id="missed-h" className="text-lg font-semibold text-forest">Review what you missed</h2>
            <div className="mt-3 flex flex-col gap-3">
              {missed.map((q) => {
                const chosen = selections[q.id];
                return (
                  <Card key={q.id}>
                    <CardBody className="pt-4">
                      <p className="text-[15px] font-medium text-forest">{q.prompt}</p>
                      <p className="mt-2 text-sm text-ink">
                        Your answer: <span className="font-medium">{q.options[chosen]?.text ?? ", "}</span>
                      </p>
                      <p className="mt-1 text-sm text-mist">{q.options[chosen]?.feedback}</p>
                      <Callout tone="positive" className="mt-3" title={`Correct: ${q.options[q.correctIndex].text}`}>
                        {q.options[q.correctIndex].feedback}
                        <span className="mt-2 block text-xs">
                          Principle: {q.principle} {" "}
                          {q.referenceIds.map((r) => <Citation key={r} id={r} />)}
                        </span>
                      </Callout>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </section>
        ) : (
          <Callout tone="positive" title="Flawless run">No questions missed. Consider practising the scenario for this module next.</Callout>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              setAttempt((a) => a + 1);
              setIndex(0);
              setSelections({});
              setRevealed({});
              setResult(null);
              setError(null);
            }}
          >
            Retake (questions reshuffle)
          </Button>
          <ButtonLink href={`/learn/${moduleSlug}`} variant="quiet">Back to module</ButtonLink>
          <ButtonLink href="/learn" variant="secondary">Dashboard</ButtonLink>
        </div>
      </div>
    );
  }

  if (!question) return null;
  const selected = selections[question.id];
  const isRevealed = revealed[question.id];
  const last = index === ordered.length - 1;

  function choose(i: number) {
    if (isRevealed) return;
    setSelections((s) => ({ ...s, [question.id]: i }));
    setRevealed((r) => ({ ...r, [question.id]: true }));
  }

  function next() {
    if (last) {
      startTransition(async () => {
        const answers = ordered.map((q) => ({ questionId: q.id, selected: selections[q.id] ?? 0 }));
        const res = await submitQuizAttempt({ slug: moduleSlug, answers });
        if (!res.ok) {
          setError("The server could not validate this attempt. Please try again.");
          return;
        }
        setResult(res);
        router.refresh();
      });
      return;
    }
    setIndex((i) => i + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <ProgressBar value={progress} max={ordered.length} label={`question ${progress + 1 || 1} of ${ordered.length}`} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${attempt}-${question.id}`}
          initial={reduced ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="group"
          aria-label={`Question ${index + 1} of ${ordered.length}`}
          tabIndex={-1}
        >
          <Card>
            <CardBody className="pt-5">
              <Badge tone="info">{moduleTitle}</Badge>
              <h2 className="mt-2 text-lg font-semibold text-forest">{question.prompt}</h2>
              <div className="mt-4 flex flex-col gap-2.5" role="radiogroup" aria-label="Choose an answer">
                {question.options.map((opt, i) => {
                  const chosen = selected === i;
                  const correctOne = i === question.correctIndex;
                  const state = isRevealed ? (correctOne ? "correct" : chosen ? "incorrect" : "dim") : "idle";
                  return (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={chosen}
                      disabled={isRevealed}
                      onClick={() => choose(i)}
                      data-testid="quiz-option"
                      className={cn(
                        "flex items-start gap-2.5 rounded-lg border px-4 py-3 text-left text-[15px] transition",
                        state === "idle" && "border-forest-100 hover:border-forest-500/60 hover:bg-quietblue/20",
                        state === "correct" && "border-[#1e7a46] bg-[#e9f6ee]",
                        state === "incorrect" && "border-[#a3532b] bg-[#f9ede4]",
                        state === "dim" && "border-forest-100 opacity-65",
                      )}
                    >
                      <span aria-hidden="true" className="mt-0.5">
                        {state === "correct" ? "✓" : state === "incorrect" ? "✗" : "○"}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence initial={false}>
                {isRevealed ? (
                  <motion.div
                    role="status"
                    aria-live="assertive"
                    data-testid="answer-feedback"
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 rounded-lg bg-canvas p-4 ring-1 ring-forest-100"
                  >
                    <p className="text-sm font-semibold text-forest">
                      {evaluateAnswer(question, selections[question.id]).correct
                        ? "Correct."
                        : `Not quite. The answer: ${question.options[question.correctIndex].text}`}
                    </p>
                    <p className="mt-1.5 text-sm text-ink">{question.principle}</p>
                    <p className="mt-1.5 text-sm text-mist">
                      {question.options[question.correctIndex].feedback}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {error ? (
                <p role="alert" className="mt-3 text-sm font-medium text-[#a3532b]">{error}</p>
              ) : null}

              <div className="mt-5 flex justify-end">
                <Button disabled={!isRevealed || pending} onClick={next}>
                  {pending ? "Saving…" : last ? "See my result" : "Next question"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
