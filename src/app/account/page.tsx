import Link from "next/link";
import { currentProfile } from "@/lib/server/profile";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccountCard } from "./account-card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const { kind, profile } = await currentProfile();
  const rec = kind === "known" ? profile : null;
  const known = rec !== null;
  const hasActivity =
    rec !== null &&
    (Object.keys(rec.lessonProgress).length > 0 ||
      rec.quizAttempts.length > 0 ||
      rec.scenarioRuns.length > 0 ||
      rec.actions.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-forest">Your account</h1>
        <p className="prose-readable max-w-2xl text-[15px] text-mist">
          As a guest, your progress is saved in this browser only. If you register, it stays on the
          machine running MINDSTEP and you can sign in again later. Either way, your data stays
          local (see <Link href="/privacy" className="underline">privacy</Link>).
        </p>
      </header>

      <div className="mt-8">
        <Card>
          <CardBody className="pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={known ? "positive" : "neutral"}>
                {known ? "Active session" : "No session yet"}
              </Badge>
              {known ? (
                <span className="text-sm text-mist">
                  {rec.kind === "account"
                    ? `Signed in${rec.displayName ? ` as ${rec.displayName}` : ""}${rec.email ? ` (${rec.email})` : ""}`
                    : "Browsing as a guest in this browser"}
                </span>
              ) : null}
            </div>
            {rec && hasActivity ? (
              <p className="mt-3 text-sm text-mist">
                So far this session has {Object.keys(rec.lessonProgress).length} lesson records,{" "}
                {rec.quizAttempts.length} quiz attempts, {rec.scenarioRuns.length} practice runs,
                and {rec.actions.length} planner items.
              </p>
            ) : null}
            <div className="mt-5">
              <AccountCard known={known} />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardBody className="pt-5">
          <h2 className="text-lg font-semibold text-forest">How your data is handled</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-mist">
            <li>Guest progress is tied to an anonymous session in your browser. No email needed.</li>
            <li>Registering stores your name, email, and a secure hash of your password, never the password itself.</li>
            <li>Signing in merges any guest progress from this browser into your account.</li>
            <li>&ldquo;Delete my data&rdquo; below erases everything tied to this session immediately.</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
