import { scenarios } from "@/content/scenarios";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Art, moduleArt } from "@/components/visual/art";
import { currentProfile } from "@/lib/server/profile";

export const dynamic = "force-dynamic";

export const metadata = { title: "Practice conversations" };

const topicLabels: Record<string, string> = {
  "supportive-communication": "Talking and helping",
  "myths-stigma": "Myths and stigma",
  "stress-coping": "Stress and coping",
  "when-to-seek-help": "Getting help",
};

export default async function ScenariosPage() {
  const { profile } = await currentProfile();
  const runsByScenario = new Map<string, number>();
  for (const r of profile?.scenarioRuns ?? []) {
    runsByScenario.set(r.scenarioId, (runsByScenario.get(r.scenarioId) ?? 0) + 1);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-forest">Practice conversations</h1>
          <p className="prose-readable mt-3 text-[15px] leading-relaxed text-mist">
            Knowledge doesn&apos;t answer the phone at 11pm. Practice does. Your choices branch, the feedback is honest, and nothing here shames you.
          </p>
        </div>
        <Art name="role-play" priority className="w-full max-w-[180px] shrink-0 animate-float" />
      </header>

      <Callout tone="note" className="mt-6" title="These stories are made up. The support is real">
        The people and situations are fictional. The services they mention are real and checked. Nothing here is a diagnosis.
      </Callout>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {scenarios.map((s) => {
          const runs = runsByScenario.get(s.id) ?? 0;
          return (
            <Card key={s.id} className="transition hover:ring-forest-500">
              <CardBody className="pt-5 flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Badge tone="info">{topicLabels[s.moduleId] ?? "Practice"}</Badge>
                      <span className="text-xs text-mist">{s.minutes} min · {runs > 0 ? `${runs} run${runs > 1 ? "s" : ""}` : "Not practised yet"}</span>
                    </div>
                    <h2 className="mt-2 text-lg font-semibold text-forest">{s.title}</h2>
                  </div>
                  <Art
                    name={moduleArt[s.moduleId] ?? "role-play"}
                    alt=""
                    className="hidden w-20 max-w-20 shrink-0 sm:block"
                  />
                </div>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-mist">{s.summary}</p>
                <div className="mt-4">
                  <ButtonLink href={`/scenarios/${s.id}`} size="sm">
                    {runs > 0 ? "Practise again" : "Start scenario"}
                  </ButtonLink>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
