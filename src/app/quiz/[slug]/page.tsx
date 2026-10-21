import Link from "next/link";
import { notFound } from "next/navigation";
import { moduleBySlug, questionsOfModule } from "@/content";
import { QuizRunner } from "@/components/learning/quiz-runner";
import { Callout } from "@/components/ui/callout";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = moduleBySlug(slug);
  return { title: mod ? `${mod.title}. Knowledge check` : "Knowledge check" };
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = moduleBySlug(slug);
  if (!mod) notFound();
  const questions = questionsOfModule(mod.id);
  if (questions.length === 0) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href="/learn" className="text-quietblue-600 hover:underline">Dashboard</Link>
        <span aria-hidden="true" className="mx-1 text-mist">/</span>
        <Link href={`/learn/${mod.slug}`} className="text-quietblue-600 hover:underline">{mod.title}</Link>
        <span aria-hidden="true" className="mx-1 text-mist">/</span>
        <span className="text-mist">Knowledge check</span>
      </nav>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-forest">{mod.title}</h1>
      <p className="mt-2 text-[15px] text-mist">
        {questions.length} questions · answer feedback on every option · your result saves to your
        dashboard.
      </p>

      <div className="mt-8">
        <QuizRunner questions={questions} moduleTitle={mod.title} moduleSlug={mod.slug} />
      </div>

      <Callout tone="note" className="mt-10" title="What this score is and isn't">
        The result is a knowledge indicator for study organisation. It cannot and does not assess
        your mental health or anyone else&apos;s. No quiz on MINDSTEP identifies or predicts
        conditions.
      </Callout>
    </div>
  );
}
