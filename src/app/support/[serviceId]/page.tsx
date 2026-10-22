import Link from "next/link";
import { notFound } from "next/navigation";
import { serviceById } from "@/content";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { Callout } from "@/components/ui/callout";

export async function generateMetadata({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params;
  const service = serviceById(serviceId);
  return { title: service ? service.name : "Service" };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params;
  const service = serviceById(serviceId);
  if (!service) notFound();

  const rows: { label: string; value: string | null; note?: string }[] = [
    { label: "Phone", value: service.phone, note: service.phoneNote ?? undefined },
    { label: "Website", value: service.website, note: "Opening times are on the service website if they are published." },
    { label: "Address", value: service.address, note: service.address ? undefined : "We could not confirm a street address, so we left it out." },
    { label: "Cost", value: service.costInfo ?? null },
    { label: "Accessibility", value: service.accessibility },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href="/support" className="text-quietblue-600 hover:underline">Find support</Link>
        <span aria-hidden="true" className="mx-1 text-mist">/</span>
        <span className="text-mist">{service.name}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-forest">{service.name}</h1>
        <Badge tone={service.verification.status === "verified" ? "positive" : "warning"}>
          {service.verification.status === "verified" ? "Verified" : "Awaiting verification"}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-mist">
        {service.types.join(" · ")} · {service.city ? `${service.city}, ` : ""}{service.region}
      </p>

      <p className="prose-readable mt-4 text-[15px] leading-relaxed text-ink">{service.description}</p>

      <Card className="mt-6">
        <CardBody className="pt-5">
          <h2 className="font-semibold text-forest">Contact and practical details</h2>
          <dl className="mt-3 flex flex-col gap-3">
            {rows.map((r) => (
              <div key={r.label} className="rounded-lg bg-canvas px-4 py-3 ring-1 ring-forest-100">
                <dt className="text-xs font-semibold uppercase tracking-wider text-mist">{r.label}</dt>
                <dd className="mt-1 text-[15px] text-ink">
                  {r.value ? (
                    r.value.startsWith("http") ? (
                      <a href={r.value} target="_blank" rel="noreferrer" className="underline">
                        {r.value}
                      </a>
                    ) : (
                      r.value
                    )
                  ) : (
                    <span className="italic text-mist">Not confirmed, so we left it out</span>
                  )}
                  {r.note ? <p className="mt-0.5 text-xs text-mist">{r.note}</p> : null}
                </dd>
              </div>
            ))}
          </dl>
        </CardBody>
      </Card>

      <Callout tone="note" title="Verification trail" className="mt-6">
        <p>
          Status: <strong>{service.verification.status === "verified" ? "verified" : "awaiting verification"}</strong> · checked{" "}
          <strong>{service.verification.verifiedAt}</strong> against{" "}
          <a href={service.verification.sourceUrl} target="_blank" rel="noreferrer" className="underline">
            {service.verification.sourceTitle}
          </a>
          . {service.verification.note}
        </p>
      </Callout>

      <Callout tone="safety" title="Safety note" className="mt-4">
        MINDSTEP lists information only. Your call or visit is the real check. Verify details on
        the official page if it has been a while. In immediate danger call <strong>112</strong>.
        For mental health support, call <strong>0800 678 678</strong> (free and confidential).
      </Callout>

      <div className="mt-6">
        <Link href="/support" className="text-sm text-quietblue-600 hover:underline">← Back to directory</Link>
      </div>
    </div>
  );
}
