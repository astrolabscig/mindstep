import Link from "next/link";
import { currentProfile } from "@/lib/server/profile";
import { modules } from "@/content/modules";
import { lessons } from "@/content/lessons";
import { scenarios } from "@/content/scenarios";
import { buildRecommendations } from "@/lib/domain/recommend";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar, EmptyState } from "@/components/ui/progress";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { RecallReview } from "@/components/learning/review-panel";
import { Art, moduleArt } from "@/components/visual/art";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard" };

export default async function LearnPage() {
  const { kind, profile } = await currentProfile();
  const lessonProgress = profile?.lessonProgress ?? {};
  const completed = Object.entries(lessonProgress).filter(([, v]) => v.completed).map(([k]) => k);
  const partial = lessons
    .filter((l) => lessonProgress[l.id] && !lessonProgress[l.id]?.completed)
    .map((l) => l.id);

  const latestAttempts = new Map<string, { percentage: number; attemptedAt: string }>();
  for (const a of profile?.quizAttempts ?? []) {
    const prev = latestAttempts.get(a.moduleId);
    if (!prev || prev.attemptedAt < a.attemptedAt) latestAttempts.set(a.moduleId, { percentage: a.percentage, attemptedAt: a.attemptedAt });
  }

  const recommendations = buildRecommendations({
    completedLessonIds: completed,
    partiallyCompletedLessonIds: partial,
    latestAttempts: Object.fromEntries(latestAttempts),
    practisedScenarioIds: (profile?.scenarioRuns ?? []).map((r) => r.scenarioId),
  }, { limit: 3 });

  const continueLessonId =
    partial[0] ??
    lessons.find((l) => !lessonProgress[l.id]?.completed)?.id;

  const lessonsDone = completed.length;
  const nextModule = modules.find((m) => !m.lessonIds.every((lid) => completed.includes(lid)));
  const scenariosTried = new Set((profile?.scenarioRuns ?? []).map((r) => r.scenarioId)).size;
  const avgValues = [...latestAttempts.values()].map((a) => a.percentage);
  const avgCheck = avgValues.length ? Math.round(avgValues.reduce((s, p) => s + p, 0) / avgValues.length) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-forest">
            {kind === "known" && profile?.onboarding ? "Welcome back 👋" : "Your dashboard"}
          </h1>
          <p className="prose-readable text-[15px] text-mist">
            Only your activity here. MINDSTEP never profiles your mood.
          </p>
        </div>
        {nextModule ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-forest ring-1 ring-forest-100" data-testid="next-up-chip">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="4" width="14" height="13" rx="3" />
              <path d="M3 8h14M7 2.5V5.5M13 2.5V5.5" />
            </svg>
            Next up · {nextModule.title}
          </span>
        ) : null}
      </header>

      {/* Reference-feel stat strip: big thin numbers, icon chips, status dots */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3" data-testid="stat-strip">
        <StatCard
          label="Lessons completed"
          value={String(lessonsDone)}
          unit={`/ ${lessons.length}`}
          dot={lessonsDone === lessons.length ? "done" : lessonsDone > 0 ? "under way" : "not started"}
        />
        <StatCard
          label="Knowledge checks"
          value={String(latestAttempts.size)}
          unit={`/ ${modules.length}`}
          dot={
            latestAttempts.size === 0
              ? "not started"
              : avgCheck >= 70
                ? "strong recall"
                : avgCheck >= 40
                  ? "building"
                  : "worth a re-look"
          }
          note={latestAttempts.size > 0 ? `avg ${avgCheck}%` : undefined}
        />
        <StatCard
          label="Conversations practised"
          value={String(scenariosTried)}
          unit={`/ ${scenarios.length}`}
          dot={scenariosTried === scenarios.length ? "done" : scenariosTried > 0 ? "under way" : "not started"}
        />
      </div>

      {/* Continue learning + recommendations */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <section aria-labelledby="continue-h">
          <h2 id="continue-h" className="text-lg font-semibold text-forest">Pick up where you left off</h2>
          {continueLessonId ? (
            <ContinueCard lessonId={continueLessonId} done={lessonsDone} total={lessons.length} />
          ) : (
            <Card className="mt-3">
              <CardBody className="pt-5">
                <p className="text-sm text-mist">
                  You have finished every lesson. You can retry a quiz, practise a conversation, or make a plan.
                </p>
                <div className="mt-4 flex gap-2">
                  <ButtonLink href="/scenarios" size="sm">Practise a conversation</ButtonLink>
                  <ButtonLink href="/support" size="sm" variant="quiet">Find support</ButtonLink>
                </div>
              </CardBody>
            </Card>
          )}

          <h2 id="rec-h" className="mt-8 text-lg font-semibold text-forest">
            Recommended for you{" "}
            <span className="text-xs font-normal text-mist">(every suggestion says why)</span>
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {recommendations.length === 0 ? (
              <EmptyState
                title="No recommendations yet"
                description="Suggestions appear after you open a lesson or try a quiz. They come from your own activity, never a guess."
                art="learning"
              />
            ) : (
              recommendations.map((r) => (
                <Card key={r.href + r.kind} className="transition hover:ring-forest-500">
                  <CardBody className="pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="info">{labelFor(r.kind)}</Badge>
                      <p className="text-sm font-medium text-forest">{r.moduleTitle}</p>
                    </div>
                    <p className="mt-2 text-sm text-ink">{r.reason}</p>
                    <Link href={r.href} className={buttonClasses("secondary", "sm", "mt-3")}>
                      {r.kind === "quiz-rereview" ? "Retry the quiz" :
                        r.kind === "practice" ? "Practise this conversation" : "Continue lesson"}
                      <span aria-hidden="true"> →</span>
                    </Link>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Right column: path progress + activity */}
        <section aria-labelledby="path-h" className="flex flex-col gap-6">
          <div>
            <h2 id="path-h" className="text-lg font-semibold text-forest">Your path</h2>
            <Card className="mt-3">
              <CardBody className="pt-5">
                <ProgressBar value={lessonsDone} max={lessons.length} label={`${lessonsDone} of ${lessons.length} lessons completed`} />
                <ul className="mt-5 flex flex-col gap-2.5">
                  {modules.map((m) => {
                    const doneCount = m.lessonIds.filter((l) => completed.includes(l)).length;
                    const latest = latestAttempts.get(m.id);
                    return (
                      <li key={m.id}>
                        <Link
                          href={`/learn/${m.slug}`}
                          className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-forest-100/40"
                        >
                          <span className="flex items-center gap-2 font-medium text-forest">
                            <span
                              aria-hidden="true"
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                doneCount === m.lessonIds.length ? "bg-correct" : doneCount > 0 ? "bg-amber" : "bg-[#cdd4cf]"
                              }`}
                            />
                            {m.title}
                          </span>
                          <span className="flex items-center gap-2">
                            {latest ? (
                              <Badge tone={latest.percentage >= 70 ? "positive" : "warning"}>
                                check {latest.percentage}%
                              </Badge>
                            ) : null}
                            <span className="text-xs text-mist" aria-label={`${doneCount} of ${m.lessonIds.length} lessons done`}>
                              {doneCount}/{m.lessonIds.length}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CardBody>
            </Card>
          </div>

          {kind === "known" ? (
            <RecallReview
              missedQuestionIds={profile?.quizAttempts.slice(-3).flatMap((a) => a.missedQuestionIds.slice(0, 2)) ?? []}
              nextModuleSlug={nextModule?.slug}
            />
          ) : (
            <Card>
              <CardBody className="pt-5">
                <h3 className="font-semibold text-forest">You&apos;re browsing as a guest</h3>
                <p className="mt-1 text-sm text-mist">
                  Progress saves in this browser. Create an account to keep it.
                </p>
                <ButtonLink href="/account" size="sm" variant="quiet" className="mt-3">
                  Sign in or create an account
                </ButtonLink>
              </CardBody>
            </Card>
          )}

          {/* Scenarios quick access */}
          <Card>
            <CardBody className="pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-forest">Practice conversations</h3>
                  <p className="mt-1 text-sm text-mist">
                    {scenarios.length} branching conversations. You have tried{" "}
                    {new Set((profile?.scenarioRuns ?? []).map((r) => r.scenarioId)).size}.
                  </p>
                  <div className="mt-3">
                    <ButtonLink href="/scenarios" size="sm" variant="secondary">Open practice</ButtonLink>
                  </div>
                </div>
                <div className="hidden w-20 shrink-0 sm:block">
                  <Art name="friends-talking" className="animate-float-delayed" />
                </div>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}

function labelFor(kind: string): string {
  switch (kind) {
    case "quiz-rereview": return "Quiz review";
    case "continue-lesson": return "Finish what you started";
    case "next-lesson": return "Next lesson";
    case "practice": return "Conversation practice";
    default: return "Recommended";
  }
}

/** Reference-feel stat card: icon chip, big thin number, status dot. */
function StatCard({
  label,
  value,
  unit,
  dot,
  note,
}: {
  label: string;
  value: string;
  unit?: string;
  dot: string;
  note?: string;
}) {
  const tone =
    dot === "done" || dot === "strong recall"
      ? "bg-correct"
      : dot === "not started"
        ? "bg-[#cdd4cf]"
        : "bg-amber";
  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-mist">{label}</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight text-forest">
              {value}
              {unit ? <span className="ml-1 text-xs font-medium text-mist">{unit}</span> : null}
            </p>
          </div>
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-100/50 text-forest">
            <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.6">
              {label.startsWith("Lessons") ? <path d="M3 4.5A1.5 1.5 0 014.5 3H9v14H4.5A1.5 1.5 0 013 15.5v-11zM11 3h4.5A1.5 1.5 0 0117 4.5v11a1.5 1.5 0 01-1.5 1.5H11V3z" /> : null}
              {label.startsWith("Knowledge") ? <path d="M10 3l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L4.2 7.2l4-.6L10 3z" strokeLinejoin="round" /> : null}
              {label.startsWith("Conversations") ? <path d="M4 5h12v9H9l-3.5 3v-3H4V5zM7.5 9h7M7.5 11.5h4.5" /> : null}
            </svg>
          </span>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-mist">
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tone}`} />
          {dot}
          {note ? <span className="text-mist/70">· {note}</span> : null}
        </p>
      </CardBody>
    </Card>
  );
}

function ContinueCard({ lessonId, done, total }: { lessonId: string; done: number; total: number }) {
  const lesson = lessons.find((l) => l.id === lessonId)!;
  const moduleOf = modules.find((m) => m.id === lesson.moduleId)!;
  return (
    <Card className="mt-3 ring-forest-500/40">
      <CardBody className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-quietblue-600">Continue</p>
            <h3 className="mt-1 text-xl font-semibold text-forest">{lesson.title}</h3>
            <p className="mt-1 text-sm text-mist">{moduleOf.title} · lesson {lesson.order}</p>
          </div>
          <div className="hidden w-24 shrink-0 sm:block">
            <Art name={moduleArt[moduleOf.id] ?? "learning"} className="animate-float" />
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={done} max={total} label="your progress" />
        </div>
        <div className="mt-4">
          <ButtonLink href={`/lesson/${lesson.id}`}>Resume lesson</ButtonLink>
        </div>
      </CardBody>
    </Card>
  );
}
