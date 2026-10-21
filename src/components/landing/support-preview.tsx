import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supportServices } from "@/content/support-services";

export function SupportPreview() {
  const preview = supportServices.slice(0, 3);
  return (
    <Card className="h-full">
      <CardBody className="pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-quietblue-600">From the directory</p>
        <h3 className="mt-2 text-lg font-semibold text-forest">National services, with sources</h3>
        <ul className="mt-4 flex flex-col gap-3">
          {preview.map((s) => (
            <li key={s.id} className="rounded-lg bg-canvas px-4 py-3 ring-1 ring-forest-100">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-forest">{s.name}</p>
                <Badge tone={s.verification.status === "verified" ? "positive" : "warning"}>
                  {s.verification.status === "verified" ? "verified" : "awaiting verification"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-mist">{s.description.slice(0, 96)}…</p>
              {s.phone ? (
                <p className="mt-1 text-sm font-medium text-forest-700">
                  {s.phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}
                </p>
              ) : (
                <p className="mt-1 text-xs text-mist/80">We could not confirm a number, so we left it out.</p>
              )}
              <p className="mt-1 text-xs text-mist/70">Checked {s.verification.verifiedAt} · source on the service page</p>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
