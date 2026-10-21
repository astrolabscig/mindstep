import { readAdminFlag } from "@/lib/session";
import { readDb } from "@/lib/store/file-store";
import { lessons } from "@/content/lessons";
import { supportServices } from "@/content/support-services";
import { moduleMap } from "@/content/modules";
import { adminKeyConfigured } from "@/lib/session";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { AdminPanel } from "./admin-panel";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  if (!adminKeyConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-forest">Admin</h1>
        <Callout tone="caution" title="Admin key not configured" className="mt-6">
          Set the <code>ADMIN_KEY</code> environment variable (at least 8 characters. See{" "}
          <code>.env.example</code>) to enable the moderation area. Without it, admin actions are
          rejected server-side.
        </Callout>
      </div>
    );
  }

  const authed = await readAdminFlag();
  const db = readDb();
  const unpublished = new Set(db.overrides.unpublishedLessonIds);
  const latestVerification = new Map<string, (typeof db.verifications)[number]>();
  for (const v of db.verifications) latestVerification.set(v.serviceId, v);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-forest">Moderation area</h1>
        <p className="prose-readable max-w-2xl text-[15px] text-mist">
          Content overrides and directory re-verification. Every action is appended to the revision
          log below with its actor and timestamp. Moderation here is auditable by design.
        </p>
      </header>

      {!authed ? (
        <AdminPanel key="login" mode="login" />
      ) : (
        <>
          <AdminPanel key="panel" mode="panel" />

          <section aria-labelledby="lessons-h" className="mt-8">
            <h2 id="lessons-h" className="text-xl font-semibold text-forest">Lesson publication</h2>
            <p className="mt-1 text-sm text-mist">
              Unpublished lessons are hidden from the learning path. Publishing state is an
              override on top of the validated content, and each change is revision-logged.
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {lessons.map((l) => {
                const isPublished = !unpublished.has(l.id);
                return (
                  <li key={l.id}>
                    <Card>
                      <CardBody className="flex flex-wrap items-center justify-between gap-3 py-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone={isPublished ? "positive" : "warning"}>
                              {isPublished ? "published" : "unpublished"}
                            </Badge>
                            <span className="text-sm font-medium text-forest">{l.title}</span>
                          </div>
                          <p className="mt-1 text-xs text-mist">
                            {moduleMap[l.moduleId]?.title ?? l.moduleId} · {l.id}
                          </p>
                        </div>
                        <AdminPanel
                          mode="lesson-row"
                          lessonId={l.id}
                          lessonTitle={l.title}
                          published={isPublished}
                        />
                      </CardBody>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="verify-h" className="mt-10">
            <h2 id="verify-h" className="text-xl font-semibold text-forest">Directory verification</h2>
            <p className="mt-1 max-w-2xl text-sm text-mist">
              Re-confirm a listing against its cited source. A status of
              &ldquo;awaiting-verification&rdquo; flags the entry honestly, it never deletes it or
              invents replacement data.
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {supportServices.map((s) => {
                const last = latestVerification.get(s.id);
                const status = last?.status ?? s.verification.status;
                return (
                  <li key={s.id}>
                    <Card>
                      <CardBody className="py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={status === "verified" ? "positive" : "warning"}>{status}</Badge>
                          <span className="text-sm font-medium text-forest">{s.name}</span>
                        </div>
                        <p className="mt-1 text-xs text-mist">
                          Last checked {last?.verifiedAt ?? s.verification.verifiedAt}
                          {last?.note ? `, ${last.note}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-mist">
                          Source: {s.verification.sourceTitle}
                        </p>
                        <div className="mt-3">
                          <AdminPanel mode="verify-row" serviceId={s.id} serviceName={s.name} />
                        </div>
                      </CardBody>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="log-h" className="mt-10">
            <h2 id="log-h" className="text-xl font-semibold text-forest">Revision log</h2>
            {db.revisions.length === 0 ? (
              <p className="mt-2 text-sm text-mist">No revisions recorded yet.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-1.5">
                {db.revisions.slice(-20).reverse().map((r) => (
                  <li key={r.id} className="rounded-lg bg-white px-4 py-2.5 text-sm ring-1 ring-forest-100">
                    <span className="text-xs text-mist">
                      {r.at.slice(0, 16).replace("T", " ")} · {r.actor} · {r.action}
                    </span>
                    <p className="text-ink">{r.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
