"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Choice = { id: string; label: string; quality: "best" | "acceptable" | "poor"; consequence: string };

const PREVIEW_CHOICES: Choice[] = [
  {
    id: "press",
    label: "“Ama, you have to talk to me. What is wrong with you?”",
    quality: "poor",
    consequence:
      "Ama says “I said I'm busy” and the door closes. Pressure framed as accusation usually produces a shorter exit, not a longer conversation.",
  },
  {
    id: "notice",
    label: "“I've noticed you've not come to study group. No pressure. I'm around whenever.”",
    quality: "best",
    consequence:
      "Ama says nothing at the door, but 40 minutes later texts: “Thanks. Sorry about today.” The conversation hasn't opened yet, but it hasn't closed either.",
  },
  {
    id: "avoid",
    label: "Say nothing and walk away quickly",
    quality: "acceptable",
    consequence:
      "Ama seems relieved, but you leave the opening unsaid. Withdrawn friends rarely start again alone, and that silence has a cost.",
  },
];

export function ScenarioPreview() {
  const [selected, setSelected] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const chosen = PREVIEW_CHOICES.find((c) => c.id === selected);

  return (
    <div className="rounded-card bg-white p-5 ring-1 ring-forest-100 shadow-sm sm:p-6" data-testid="scenario-preview">
      <Badge tone="info">Try it · Ama has gone quiet</Badge>
      <h3 className="mt-3 text-lg font-semibold text-forest">In the corridor, Ama opens the door halfway: &ldquo;I&apos;m busy.&rdquo;</h3>
      <p className="mt-2 text-sm leading-relaxed text-mist">
        You have one minute. She has been missing study group for three weeks.
      </p>

      <div className="mt-4 flex flex-col gap-2.5" role="radiogroup" aria-label="Choose a response">
        {PREVIEW_CHOICES.map((c) => {
          const isSelected = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(c.id)}
              aria-disabled={selected !== null && !isSelected}
              className={
                "rounded-lg border px-4 py-3 text-left text-[15px] transition " +
                (isSelected
                  ? "border-forest-500 bg-forest-100/70 font-medium text-forest-900"
                  : "border-forest-100 bg-canvas text-ink hover:border-forest-500/50 hover:bg-quietblue/30")
              }
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {chosen ? (
          <motion.div
            key={chosen.id}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-5"
            role="status"
            aria-live="polite"
          >
            <div className="rounded-lg bg-canvas p-4 ring-1 ring-forest-100">
              <Badge tone={chosen.quality === "best" ? "positive" : chosen.quality === "acceptable" ? "neutral" : "warning"}>
                {chosen.quality === "best" ? "Strong choice" : chosen.quality === "acceptable" ? "Safe but incomplete" : "Costs a real opening"}
              </Badge>
              <p className="mt-2 text-sm leading-relaxed text-ink">{chosen.consequence}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                Try another response
              </Button>
              <ButtonLink href="/scenarios/friend-withdrawn" size="sm" variant="primary">
                Open the full conversation
              </ButtonLink>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
