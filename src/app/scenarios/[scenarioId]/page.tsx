import Link from "next/link";
import { notFound } from "next/navigation";
import { scenarioById, moduleMap } from "@/content";
import { ScenarioRunner } from "@/components/learning/scenario-runner";
import { Callout } from "@/components/ui/callout";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = scenarioById(scenarioId);
  return { title: scenario ? scenario.title : "Scenario" };
}

export default async function ScenarioPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = scenarioById(scenarioId);
  if (!scenario) notFound();
  const mod = moduleMap[scenario.moduleId];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href="/scenarios" className="text-quietblue-600 hover:underline">Scenario Lab</Link>
        <span aria-hidden="true" className="mx-1 text-mist">/</span>
        <span className="text-mist">{scenario.title}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-forest">{scenario.title}</h1>
        <Badge tone="info">{mod?.title ?? ""}</Badge>
      </div>

      <Callout tone="note" title="The situation" className="mt-5">
        {scenario.context}
      </Callout>

      <div className="mt-8">
        <ScenarioRunner scenario={scenario} />
      </div>

      <Callout tone="safety" className="mt-10" title="If this is real, right now">
        Scenarios are practice. If a real person may be in immediate danger, call{" "}
        <strong>112</strong>. For confidential support tonight, the Mental Health Authority&apos;s
        free line is <strong>0800 678 678</strong>. MINDSTEP does not monitor anything.
      </Callout>
    </div>
  );
}
