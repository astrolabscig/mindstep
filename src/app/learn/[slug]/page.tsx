import Link from "next/link";
import { notFound } from "next/navigation";
import { moduleBySlug, lessonsOfModule, questionsOfModule, scenarios } from "@/content";
import { currentProfile } from "@/lib/server/profile";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Citation } from "@/components/ui/citation";
import { Art, moduleArt } from "@/components/visual/art";
import { ScenarioChip } from "@/components/learning/scenario-chip";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = moduleBySlug(slug);
  return { title: mod ? mod.title : "Module" };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = moduleBySlug(slug);
  if (!mod) notFound();

  const lessonList = lessonsOfModule(mod.id);
  const quizCount = questionsOfModule(mod.id).length;
  const { profile } = await currentProfile();
  const completed = (profile?.lessonProgress ?? {});

  const moduleScenarios = scenarios.filter((s) => s.moduleId === mod.id);
  const referencesUsed = lessonList.flatMap((l) => l.referenceIds);
  const uniqueRefs = Array.from(new Set(referencesUsed));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/learn" className="text-sm text-quietblue-600 hover:underline">
        ← Dashboard
      </Link>
      <header className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-quietblue-600">Module {mod.order}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-forest">{mod.title}</h1>
        <p className="prose-readable mt-3 text-[15px] leading-relaxed text-mist">{mod.problem}</p>
      </header>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_300px]">
        <section aria-label="Lessons" className="flex flex-col gap-4">
          {lessonList.map((lesson, i) => {
            const state = completed[lesson.id];
            return (
              <Card key={lesson.id}>
                <CardBody className="pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-mist">
                      Lesson {i + 1}
                    </p>
                    {state?.completed ? <Badge tone="positive">Completed</Badge> : state ? <Badge tone="warning">In progress</Badge> : null}
                  </div>
                  <h2 className="mt-1 text-lg font-semibold text-forest">
                    <Link href={`/lesson/${lesson.id}`} className="hover:underline">
                      {lesson.title}
                    </Link>
                  </h2>
                  <p className="mt-1.5 text-sm text-mist">{lesson.objective}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    <ButtonLink href={`/lesson/${lesson.id}`} size="sm" variant={state?.completed ? "quiet" : "primary"}>
                      {state?.completed ? "Revisit lesson" : "Open lesson"}
                    </ButtonLink>
                    <span className="self-center text-xs text-mist">
                      {lesson.quizQuestionIds.length} knowledge checks embedded
                    </span>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </section>

        <aside className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-card ring-1 ring-forest-100">
            <Art name={moduleArt[mod.id] ?? "learning"} priority />
          </div>
          <Card>
            <CardBody className="pt-5">
              <ProgressBar
                value={lessonList.filter((l) => completed[l.id]?.completed).length}
                max={lessonList.length}
                label={`${mod.title} completion`}
              />
              <div className="mt-4">
                <ButtonLink href={`/quiz/${mod.slug}`} size="sm" className="w-full justify-center">
                  Knowledge check ({quizCount} questions)
                </ButtonLink>
              </div>
            </CardBody>
          </Card>

          {moduleScenarios.length > 0 ? (
            <Card>
              <CardBody className="pt-5">
                <h2 className="font-semibold text-forest">Practise this module</h2>
                <div className="mt-2 flex flex-col gap-2">
                  {moduleScenarios.map((s) => (
                    <ScenarioChip key={s.id} scenarioId={s.id} />
                  ))}
                </div>
              </CardBody>
            </Card>
          ) : null}

          <Card>
            <CardBody className="pt-5">
              <h2 className="font-semibold text-forest">Sources behind this module</h2>
              <p className="mt-1 text-xs leading-relaxed text-mist">
                Substantive claims in these lessons are backed by the following sources (dates checked shown on tap):
              </p>
              <p className="mt-2 flex flex-wrap gap-2">
                {uniqueRefs.map((r) => (
                  <span key={r} className="rounded-md bg-canvas px-2 py-1 text-xs ring-1 ring-forest-100">
                    <Citation id={r} />
                  </span>
                ))}
              </p>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
