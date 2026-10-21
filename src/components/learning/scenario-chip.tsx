import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { scenarioById } from "@/content";

export function ScenarioChip({ scenarioId }: { scenarioId: string }) {
  const s = scenarioById(scenarioId);
  if (!s) return null;
  return (
    <Card className="bg-canvas ring-forest-100">
      <CardBody className="px-4 py-3">
        <p className="text-sm font-medium text-forest">{s.title}</p>
        <p className="mt-0.5 text-xs text-mist">{s.minutes} min · branching with feedback</p>
        <ButtonLink href={`/scenarios/${s.id}`} size="sm" variant="secondary" className="mt-2">
          Practise
        </ButtonLink>
      </CardBody>
    </Card>
  );
}
