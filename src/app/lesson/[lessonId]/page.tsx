import Link from "next/link";
import { notFound } from "next/navigation";
import { lessonById, lessonsOfModule, questionById, moduleMap } from "@/content";
import { currentProfile } from "@/lib/server/profile";
import { LessonView } from "@/components/learning/lesson-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessonById(lessonId);
  return { title: lesson ? lesson.title : "Lesson" };
}

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessonById(lessonId);
  if (!lesson) notFound();

  const mod = moduleMap[lesson.moduleId];
  const { profile } = await currentProfile();
  const alreadyCompleted = Boolean(profile?.lessonProgress[lesson.id]?.completed);

  const embedded = lesson.quizQuestionIds
    .map((id) => questionById(id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  const siblings = mod ? lessonsOfModule(mod.id) : [];
  const nextLesson = siblings.find((l) => l.order === lesson.order + 1);
  const prevLesson = siblings.find((l) => l.order === lesson.order - 1);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href="/learn" className="text-quietblue-600 hover:underline">Dashboard</Link>
        {mod ? (
          <>
            <span aria-hidden="true" className="mx-1 text-mist">/</span>
            <Link href={`/learn/${mod.slug}`} className="text-quietblue-600 hover:underline">{mod.title}</Link>
          </>
        ) : null}
        <span aria-hidden="true" className="mx-1 text-mist">/</span>
        <span className="text-mist">{lesson.title}</span>
      </nav>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-forest">{lesson.title}</h1>

      <div className="mt-8">
        <LessonView
          model={{ lessonData: lesson, embeddedQuestions: embedded, alreadyCompleted }}
          quizHref={mod ? `/quiz/${mod.slug}` : "/learn"}
        />
      </div>

      <nav aria-label="Lesson navigation" className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-forest-100 pt-6 text-sm">
        {prevLesson ? (
          <Link href={`/lesson/${prevLesson.id}`} className="text-quietblue-600 hover:underline">
            ← Previous: {prevLesson.title}
          </Link>
        ) : <span />}
        {nextLesson ? (
          <Link href={`/lesson/${nextLesson.id}`} className="text-quietblue-600 hover:underline">
            Up next: {nextLesson.title} →
          </Link>
        ) : mod ? (
          <Link href={`/quiz/${mod.slug}`} className="text-quietblue-600 hover:underline">
            Take the module knowledge check →
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
