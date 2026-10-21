"use client";

import { Card, CardBody } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { questionById } from "@/content";

/**
 * "Knowledge review" panel. Shows missed knowledge-check questions and
 * explains what to revisit. Expects ids validated server-side.
 */
export function RecallReview({
  missedQuestionIds,
  nextModuleSlug,
}: {
  missedQuestionIds: string[];
  nextModuleSlug?: string;
}) {
  const seen = new Set<string>();
  const missed = missedQuestionIds
    .map((id) => questionById(id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q))
    .filter((q) => (seen.has(q.id) ? false : (seen.add(q.id), true)))
    .slice(0, 3);

  return (
    <Card>
      <CardBody className="pt-5">
        <h3 className="font-semibold text-forest">Your review list</h3>
        {missed.length === 0 ? (
          <p className="mt-1 text-sm text-mist">
            Nothing pending. If a future knowledge check surfaces gaps, missed questions will
            appear here as a revisit list.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2.5">
            {missed.map((q) => (
              <li key={q.id} className="rounded-lg bg-canvas px-3 py-2.5 ring-1 ring-forest-100">
                <p className="text-sm text-ink">{q.prompt}</p>
                <p className="mt-1 text-xs text-mist">
                  Missed once · reread the module&apos;s lesson, then retake that check when you&apos;re ready
                </p>
              </li>
            ))}
          </ul>
        )}
        {nextModuleSlug ? (
          <div className="mt-3">
            <ButtonLink href={`/learn/${nextModuleSlug}`} size="sm" variant="quiet">
              Continue the path
            </ButtonLink>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
