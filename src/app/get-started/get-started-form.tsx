"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { saveOnboarding } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/fields";
import { cn } from "@/lib/utils";

const GOALS = [
  { id: "self-understanding", label: "Understand my own mind", hint: "Worry, low mood, sleep" },
  { id: "support-others", label: "Support other people well", hint: "Talking and helping" },
  { id: "find-services", label: "Find real services", hint: "Support directory" },
  { id: "school-work", label: "Handle school or work pressure", hint: "Overwhelm and deadlines" },
  { id: "explore", label: "Explore it all", hint: "All twelve cards" },
];

const TOPICS = [
  { id: "fundamentals", label: "Mental health basics" },
  { id: "stress", label: "Stress and coping" },
  { id: "anxiety", label: "Anxiety" },
  { id: "depression", label: "Low mood and depression" },
  { id: "stigma", label: "Myths and stigma" },
  { id: "communication", label: "Talking and helping" },
  { id: "services", label: "Support in Ghana" },
];

const PACES = [
  { id: "slow", label: "Slow", hint: "One card at a time" },
  { id: "steady", label: "Steady", hint: "A card a day" },
  { id: "fast", label: "Fast", hint: "Longer sittings" },
];

export default function GetStartedForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [pace, setPace] = useState<"slow" | "steady" | "fast">("steady");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const reduced = useReducedMotion();

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await saveOnboarding({
        goal: goal ?? "explore",
        topics,
        pace,
        reduceMotion,
      });
      if (!result.ok) {
        setError("Saving your preferences failed. You can continue without them.");
        router.push("/learn");
        return;
      }
      router.push("/learn");
      router.refresh();
    });
  }

  const canContinue = step !== 0 || goal !== null;

  return (
    <Card className="mx-auto mt-10 max-w-2xl">
      <CardBody className="pt-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-mist" aria-live="polite">
            Step {step + 1} of 4
          </p>
          <div className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn("h-1.5 w-8 rounded-full", i <= step ? "bg-sage-strong" : "bg-forest-100")} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div>
                <h2 className="text-xl font-semibold text-forest">What brings you here?</h2>
                <p className="mt-1 text-sm text-mist">You can change this later. We ask nothing sensitive, and none of it is used to profile your mental health.</p>
                <div className="mt-4 flex flex-col gap-2.5" role="radiogroup" aria-label="Choose your goal">
                  {GOALS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      role="radio"
                      aria-checked={goal === g.id}
                      onClick={() => setGoal(g.id)}
                      className={cn(
                        "rounded-lg border px-4 py-3 text-left transition",
                        goal === g.id ? "border-forest-500 bg-forest-100/70" : "border-forest-100 hover:border-forest-500/50",
                      )}
                    >
                      <span className="block text-[15px] font-medium text-forest">{g.label}</span>
                      <span className="text-xs text-mist">{g.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-forest">Any topics of interest?</h2>
                <p className="mt-1 text-sm text-mist">Optional. Pick a few, or skip.</p>
                <fieldset className="mt-4">
                  <legend className="sr-only">Topics of interest</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {TOPICS.map((t) => (
                      <Checkbox
                        key={t.id}
                        id={`topic-${t.id}`}
                        label={t.label}
                        checked={topics.includes(t.id)}
                        onChange={() =>
                          setTopics((prev) => (prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id]))
                        }
                      />
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-forest">Your pace</h2>
                <div className="mt-4 flex flex-col gap-2.5" role="radiogroup" aria-label="Choose a pace">
                  {PACES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={pace === p.id}
                      onClick={() => setPace(p.id as "slow" | "steady" | "fast")}
                      className={cn(
                        "rounded-lg border px-4 py-3 text-left transition",
                        pace === p.id ? "border-forest-500 bg-forest-100/70" : "border-forest-100 hover:border-forest-500/50",
                      )}
                    >
                      <span className="block text-[15px] font-medium text-forest">{p.label}</span>
                      <span className="text-xs text-mist">{p.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-forest">Accessibility and data</h2>
                <div className="mt-4 flex flex-col gap-4">
                  <Checkbox
                    id="reduce-motion"
                    label="Reduce motion (turns off interface animation, on top of your system setting)"
                    checked={reduceMotion}
                    onChange={() => setReduceMotion((v) => !v)}
                  />
                  <div className="rounded-lg bg-canvas p-4 text-sm leading-relaxed text-mist ring-1 ring-forest-100">
                    <p className="font-medium text-forest">What gets stored, and why</p>
                    <p className="mt-1">
                      Your choices (goal, pace, accessibility) shape your dashboard. Lesson
                      completions and quiz results are stored so progress and review make sense. We
                      never collect anything about your mood or mental health. You can delete your
                      data from the <a className="underline" href="/privacy">privacy page</a> at any time.
                    </p>
                  </div>
                  <p className="text-sm text-mist">
                    An account is <strong className="text-forest">not required</strong>. Your progress
                    lives in this browser. You can save it to an account later from the dashboard.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error ? (
          <p role="alert" className="mt-4 text-sm font-medium text-[#a3532b]">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            ) : null}
            <Button variant="ghost" onClick={() => router.push("/learn")}>
              Skip for now
            </Button>
          </div>
          {step < 3 ? (
            <Button disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button disabled={pending} onClick={submit}>
              {pending ? "Saving…" : "Finish and open my dashboard"}
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
