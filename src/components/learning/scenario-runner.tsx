"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { recordScenarioRun } from "@/app/actions";
import { getStep, getChoice, maxWalkLength } from "@/lib/domain/scenario";
import type { Scenario } from "@/content/schema";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Phase = { kind: "choosing"; nodeId: string } | { kind: "feedback"; nodeId: string; choiceId: string };

export function ScenarioRunner({ scenario }: { scenario: Scenario }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [walk, setWalk] = useState(0);
  const [worstQuality, setWorstQuality] = useState<"best" | "acceptable" | "poor">("best");
  const [recorded, setRecorded] = useState(false);
  const [pending, startTransition] = useTransition();
  const [phase, setPhase] = useState<Phase>({ kind: "choosing", nodeId: scenario.startNodeId });
  const narrRef = useRef<HTMLParagraphElement>(null);

  const step = getStep(scenario, phase.nodeId);
  const isEnd = step.type === "end" || walk >= maxWalkLength(scenario);
  const choice = phase.kind === "feedback" ? getChoice(scenario, phase.nodeId, phase.choiceId) : undefined;

  useEffect(() => {
    if (phase.kind === "feedback" || phase.kind === "choosing") {
      narrRef.current?.focus();
    }
  }, [phase]);

  useEffect(() => {
    if (isEnd && !recorded && !pending) {
      startTransition(async () => {
        // recorded is flipped inside the transition to avoid a synchronous
        // setState in the effect (cascading render lint rule).
        setRecorded(true);
        await recordScenarioRun({ scenarioId: scenario.id, worstQuality, walked: walk || 1 });
        router.refresh();
      });
    }
  }, [isEnd, recorded, pending, scenario.id, worstQuality, walk, router]);

  function pick(choiceId: string, quality: "best" | "acceptable" | "poor") {
    const rank = quality === "best" ? 0 : quality === "acceptable" ? 1 : 2;
    if (rank > (worstQuality === "best" ? 0 : worstQuality === "acceptable" ? 1 : 2)) setWorstQuality(quality);
    setPhase({ kind: "feedback", nodeId: phase.nodeId, choiceId });
  }

  function advance(next: string) {
    setWalk((w) => w + 1);
    setPhase({ kind: "choosing", nodeId: next });
  }

  function restart() {
    setRecorded(false);
    setWorstQuality("best");
    setWalk(0);
    setPhase({ kind: "choosing", nodeId: scenario.startNodeId });
  }

  if (isEnd) {
    return (
      <div className="flex flex-col gap-6" data-testid="scenario-end" role="status" aria-live="polite">
        <Card className="ring-sage-strong/50">
          <CardBody className="pt-6">
            <Badge tone="positive">Scenario complete</Badge>
            <h2 className="mt-3 text-xl font-semibold text-forest">What this practised</h2>
            <ul className="mt-2 flex flex-col gap-2">
              {scenario.end.principles.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink">
                  <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage-strong" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-lg bg-sage-soft px-4 py-3 ring-1 ring-sage-strong/40">
              <p className="text-sm font-semibold text-forest">Your next step</p>
              <p className="mt-1 text-sm text-ink">{scenario.end.nextStep}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href={scenario.end.nextStepLink}>Take the suggested next step</ButtonLink>
              <Button variant="ghost" onClick={restart} disabled={pending}>
                {pending ? "Saving…" : "Run it again. Try another path"}
              </Button>
              <ButtonLink href="/scenarios" variant="quiet">All scenarios</ButtonLink>
            </div>
          </CardBody>
        </Card>
        <p className="text-xs text-mist">
          Recorded to your dashboard as an educational activity. Nothing here assessed anyone&apos;s
          mental health.
        </p>
      </div>
    );
  }

  if (step.type !== "node") return null;
  const listening = phase.kind === "choosing";

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar value={walk} max={maxWalkLength(scenario)} label="scenario progress" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={`${phase.nodeId}-${phase.kind}-${phase.kind === "feedback" ? phase.choiceId : ""}`}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
        >
          <Card>
            <CardBody className="pt-5">
              <p
                ref={narrRef}
                tabIndex={-1}
                className="prose-readable text-[16px] leading-relaxed text-ink focus-visible:outline-none"
                data-testid="scenario-narration"
              >
                {choice && phase.kind === "feedback" ? choice.consequence : step.node.narration}
              </p>

              {listening ? (
                <>
                  <h2 className="mt-4 text-lg font-semibold text-forest" data-testid="scenario-prompt">
                    {step.node.prompt}
                  </h2>
                  <div className="mt-4 flex flex-col gap-2.5" aria-label="Available responses">
                    {step.choices.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        data-testid="scenario-choice"
                        onClick={() => pick(c.id, c.quality)}
                        className="rounded-lg border border-forest-100 bg-canvas px-4 py-3 text-left text-[15px] text-ink transition hover:border-forest-500/60 hover:bg-quietblue/25"
                      >
                        {c.text}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}

              {choice ? (
                <motion.div
                  role="status"
                  aria-live="polite"
                  data-testid="scenario-feedback"
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 rounded-lg bg-canvas p-4 ring-1 ring-forest-100"
                >
                  <Badge tone={choice.quality === "best" ? "positive" : choice.quality === "acceptable" ? "info" : "warning"}>
                    {choice.quality === "best" ? "Strong response" : choice.quality === "acceptable" ? "Workable response" : "Costs something, and that's fine to learn"}
                  </Badge>
                  <p className="mt-2 text-sm text-ink"><strong className="text-forest">What you did well:</strong> {choice.strengths}</p>
                  <p className="mt-1.5 text-sm text-mist"><strong>What it costs:</strong> {choice.limitations}</p>
                </motion.div>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span aria-hidden="true" className="text-xs text-mist">MINDSTEP · Scenario Lab</span>
                {choice ? (
                  <Button onClick={() => advance(choice.next)}>Continue</Button>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}

export function qualityLabel(q: "best" | "acceptable" | "poor"): string {
  return cn(q === "best" && "Strong", q === "acceptable" && "Workable", q === "poor" && "Costs something");
}
