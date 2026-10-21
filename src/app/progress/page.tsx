import Link from "next/link";
import { currentProfile } from "@/lib/server/profile";
import {
  lessonsCompleted,
  lessonsTotal,
  topicScores,
  scenariosPractised,
  scenariosTotal,
  reviewQueueLessonIds,
  goalsCompleted,
  metricExplanations,
} from "@/lib/domain/progress";
import { lessons } from "@/content/lessons";
import { moduleMap } from "@/content/modules";
import { scenarioById } from "@/content";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar, EmptyState } from "@/components/ui/progress";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Art } from "@/components/visual/art";

export const dynamic = "force-dynamic";

export const metadata = { title: "Your progress" };

export default async function ProgressPage() {
  const { kind, profile } = await currentProfile();

  const p = {
    lessonProgress: profile?.lessonProgress ?? {},
    quizAttempts: profile?.quizAttempts ?? [],
    scenarioRuns: profile?.scenarioRuns ?? [],
    actions: profile?.actions ?? [],
  };

  // Missed questions grouped by module feeds the review queue.
  const missedByModule: Record<string, string[]> = {};
  for (const a of p.quizAttempts) {
    const list = missedByModule[a.moduleId] ?? [];
    list.push(...a.missedQuestionIds);
    missedByModule[a.moduleId] = list;
  }

  const done = lessonsCompleted(p);
  const scores = topicScores(p);
  const practised = scenariosPractised(p);
  const queue = reviewQueueLessonIds(p, missedByModule);
  const goals = goalsCompleted(p);
  const totalActions = p.actions.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-forest">Your progress</h1>
          <p className="prose-readable max-w-2xl text-[15px] text-mist">
            Every number here is about your activity, never your mood, symptoms, or state. Each one
            explains how it is calculated.
          </p>
        </div>
        <div className="w-full max-w-[140px] shrink-0">
          <Art name="progress-path" priority className="animate-float" />
        </div>
      </header>

      {kind === "anonymous" ? (
        <Callout tone="note" title="You are browsing as a guest" className="mt-6">
          Progress starts saving in this browser as soon as you complete an activity.
          <div className="mt-2">
            <ButtonLink href="/account" size="sm" variant="quiet">Sign in or create an account to keep it</ButtonLink>
          </div>
        </Callout>
      ) : null}

      {/* Headline metrics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Lessons completed"
          value={done}
          suffix={`of ${lessonsTotal()}`}
          explanation={metricExplanations.lessonsCompleted}
          progress={{ value: done, max: lessonsTotal(), text: `${done} of ${lessonsTotal()} lessons completed` }}
        />
        <MetricCard
          label="Conversations practised"
          value={practised}
          suffix={`of ${scenariosTotal()}`}
          explanation={metricExplanations.scenariosPractised}
          progress={{ value: practised, max: scenariosTotal(), text: `${practised} of ${scenariosTotal()} conversations taken to the end` }}
        />
        <MetricCard
          label="Planner items done"
          value={goals}
          suffix={totalActions === 1 ? "of 1 added" : `of ${totalActions} added`}
          explanation={metricExplanations.goalsCompleted}
          progress={totalActions > 0 ? { value: goals, max: totalActions, text: `${goals} of ${totalActions} planner items marked done` } : undefined}
        />
      </div>

      {/* Knowledge checks per module */}
      <section aria-labelledby="quiz-h" className="mt-10">
        <h2 id="quiz-h" className="text-xl font-semibold text-forest">Quizzes</h2>
        <p className="mt-1 max-w-2xl text-sm text-mist">{metricExplanations.quizPerformance}</p>
        <div className="mt-4">
          {scores.length === 0 ? (
            <EmptyState
              title="No quizzes taken yet"
              description="Each topic ends with a short quiz. Scores appear here after your first attempt."
              action={<ButtonLink href="/learn" size="sm">Go to your dashboard</ButtonLink>}
              art="learning"
            />
          ) : (
            <div className="flex flex-col gap-3">
              {scores.map((s) => {
                const slug = moduleMap[s.moduleId]?.slug;
                const tone = s.latest === null ? "neutral" : s.latest >= 70 ? "positive" : "warning";
                return (
                  <Card key={s.moduleId}>
                    <CardBody className="pt-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={tone}>
                            {s.latest === null ? "no score yet" : `latest ${s.latest}%`}
                          </Badge>
                          <h3 className="text-[15px] font-semibold text-forest">{s.topicTitle}</h3>
                        </div>
                        <span className="text-xs text-mist">
                          {s.attempts === 1 ? "1 attempt" : `${s.attempts} attempts`}
                          {slug ? <Link href={`/quiz/${slug}`} className="ml-2 underline hover:text-forest">retake</Link> : null}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-mist">{s.explanation}</p>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Review queue */}
      <section aria-labelledby="review-h" className="mt-10">
        <h2 id="review-h" className="text-xl font-semibold text-forest">Worth another look</h2>
        <p className="mt-1 max-w-2xl text-sm text-mist">{metricExplanations.reviewQueue}</p>
        <div className="mt-4">
          {queue.length === 0 ? (
            <EmptyState
              title="Nothing queued for review"
              description="When a quiz shows a topic worth revisiting, the lesson appears here."
              art="progress-path"
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {queue.map((id) => {
                const lesson = lessons.find((l) => l.id === id);
                if (!lesson) return null;
                const mod = moduleMap[lesson.moduleId];
                return (
                  <li key={id}>
                    <Link
                      href={`/lesson/${lesson.id}`}
                      className="flex items-center justify-between gap-3 rounded-card bg-white px-4 py-3 text-sm ring-1 ring-forest-100 transition hover:ring-forest-500"
                    >
                      <span className="font-medium text-forest">{lesson.title}</span>
                      <span className="text-xs text-mist">{mod?.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Scenario history */}
      {p.scenarioRuns.length > 0 ? (
        <section aria-labelledby="runs-h" className="mt-10">
          <h2 id="runs-h" className="text-xl font-semibold text-forest">Practice log</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {p.scenarioRuns.slice(-8).reverse().map((run) => {
              const s = scenarioById(run.scenarioId);
              return (
                <li key={run.id ?? `${run.scenarioId}-${run.finishedAt}`}>
                  <Card>
                    <CardBody className="flex flex-wrap items-center justify-between gap-2 py-4">
                      <span className="text-sm font-medium text-forest">{s?.title ?? run.scenarioId}</span>
                      <span className="text-xs text-mist">
                        {run.finishedAt.slice(0, 10)} · finished
                      </span>
                    </CardBody>
                  </Card>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-mist">
            Showing your last {Math.min(8, p.scenarioRuns.length)} of {p.scenarioRuns.length} finished conversations.
          </p>
        </section>
      ) : null}

      {/* Honesty note (assignment requirement) */}
      <Callout tone="caution" title="What this page is not" className="mt-10">
        These numbers describe what you have opened and finished. They are not wellbeing scores,
        they cannot detect a mental health condition, and MINDSTEP does not monitor anyone. If you
        want to talk to a person, the <Link href="/support" className="underline">support directory</Link>{" "}
        lists services, including the national helpline{" "}
        <strong className="text-forest">0800 678 678</strong>.
      </Callout>
    </div>
  );
}

function MetricCard({
  label,
  value,
  suffix,
  explanation,
  progress,
}: {
  label: string;
  value: number;
  suffix?: string;
  explanation: string;
  progress?: { value: number; max: number; text: string };
}) {
  return (
    <Card>
      <CardBody className="pt-5">
        <p className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight text-forest">{value}</span>
          {suffix ? <span className="text-sm text-mist">{suffix}</span> : null}
        </p>
        <h3 className="mt-1 text-[15px] font-semibold text-forest">{label}</h3>
        <p className="mt-2 text-xs leading-relaxed text-mist">{explanation}</p>
        {progress ? (
          <div className="mt-3">
            <ProgressBar value={progress.value} max={progress.max} label={progress.text} />
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
