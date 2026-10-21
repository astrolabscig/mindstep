"use client";

import { useMemo, useState } from "react";
import { filterServices, regionsOf, typesOf } from "@/lib/domain/directory";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Select } from "@/components/ui/fields";
import { EmptyState } from "@/components/ui/progress";
import type { ServiceType, SupportService } from "@/content/schema";

const TYPE_LABELS: Record<ServiceType, string> = {
  helpline: "Helpline",
  hospital: "Hospital",
  clinic: "Clinic",
  counselling: "Counselling",
  emergency: "Emergency",
  directory: "Directory",
};

export function ServiceDirectory({ services }: { services: SupportService[] }) {
  const [text, setText] = useState("");
  const [region, setRegion] = useState("all");
  const [type, setType] = useState<ServiceType | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const regions = useMemo(() => ["all", ...regionsOf(services)], [services]);
  const types = useMemo(() => ["all", ...typesOf(services)], [services]);
  const results = useMemo(
    () => filterServices(services, { text, region, type, verifiedOnly }),
    [services, text, region, type, verifiedOnly],
  );

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Directory filters">
        <label className="flex flex-col gap-1 text-sm font-medium text-forest">
          Search
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search name, region…"
            className="w-full rounded-lg border border-forest-100 bg-white px-3 py-2.5 text-[15px] focus:border-forest-500 focus:outline-2 focus:outline-offset-2 focus:outline-quietblue-600"
            data-testid="service-search"
          />
        </label>
        <div className="flex flex-col gap-1 text-sm font-medium text-forest">
          Region
          <Select value={region} onChange={(e) => setRegion(e.target.value)} data-testid="service-region">
            {regions.map((r) => (
              <option key={r} value={r}>{r === "all" ? "All regions" : r}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1 text-sm font-medium text-forest">
          Service type
          <Select value={type} onChange={(e) => setType(e.target.value as ServiceType | "all")} data-testid="service-type">
            {types.map((t) => (
              <option key={t} value={t}>{t === "all" ? "All types" : TYPE_LABELS[t as ServiceType] ?? t}</option>
            ))}
          </Select>
        </div>
        <div className="flex items-end">
          <input
            id="verified-only"
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="h-5 w-5 accent-forest-600"
          />
          <label htmlFor="verified-only" className="ml-2 text-sm text-ink">
            Verified services only
          </label>
        </div>
      </div>

      <p className="mt-4 text-sm text-mist" role="status" aria-live="polite" data-testid="service-count">
        {results.length} service{results.length === 1 ? "" : "s"} shown
        {text ? <> · searching “{text}”</> : null}
      </p>

      {results.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No services match"
            description="Try a broader search or fewer filters. If what you need isn't listed, it may not be verifiable. Check the official directories linked on each service page."
            art="support-connection"
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {results.map((s) => (
            <Card key={s.id} className="transition hover:ring-forest-500" data-testid="service-card">
              <CardBody className="pt-5 flex h-full flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-[17px] font-semibold text-forest">
                    <ButtonLink href={`/support/${s.id}`} variant="ghost" size="sm" className="px-0 underline-offset-2 hover:underline">
                      {s.name}
                    </ButtonLink>
                  </h2>
                  <Badge tone={s.verification.status === "verified" ? "positive" : "warning"}>
                    {s.verification.status === "verified" ? "verified" : "awaiting verification"}
                  </Badge>
                </div>
                <p className="mt-1 flex flex-wrap gap-1.5">
                  {s.types.map((t) => (
                    <Badge key={t} tone="neutral">{TYPE_LABELS[t]}</Badge>
                  ))}
                  <Badge tone="neutral">{s.region}</Badge>
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">{s.description}</p>
                {s.phone ? (
                  <p className="mt-2 text-sm font-semibold text-forest-700" data-testid="service-phone">
                    <span className="font-normal text-mist">Phone: </span>
                    {formatPhone(s.phone)}
                  </p>
                ) : (
                  <p className="mt-2 text-xs italic text-mist">No confirmed number, so we left it out.</p>
                )}
                <p className="mt-1 text-xs text-mist/70">
                  Checked {s.verification.verifiedAt} · {s.verification.status === "verified" ? "verified" : "awaiting verification"}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function formatPhone(p: string): string {
  if (p.length === 10) return `${p.slice(0, 4)} ${p.slice(4, 7)} ${p.slice(7)}`;
  return p;
}
