import Link from "next/link";
import { currentProfile } from "@/lib/server/profile";
import { Card, CardBody } from "@/components/ui/card";
import { Callout } from "@/components/ui/callout";
import { DeleteDataButton } from "./delete-data-button";

export const dynamic = "force-dynamic";

export const metadata = { title: "Privacy" };

export default async function PrivacyPage() {
  const { kind } = await currentProfile();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-forest">Privacy</h1>
        <p className="prose-readable max-w-2xl text-[15px] text-mist">
          Plain-language summary of what MINDSTEP stores, why, and how to delete it. This instance
          runs in <strong className="text-forest">local mode</strong>: data lives in a JSON file on
          the machine running the app. It is not sent to any cloud unless a production backend has
          actually been configured and verified (see docs/safety-and-privacy.md).
        </p>
      </header>

      <section aria-labelledby="store-h" className="mt-8">
        <h2 id="store-h" className="text-xl font-semibold text-forest">What we store</h2>
        <Card className="mt-4">
          <CardBody className="pt-5">
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-mist">
              <li><strong className="text-forest">Session cookie</strong> (<code>ms_sid</code>), a random id that links your browser to a saved record. HttpOnly, same-site, 90 days.</li>
              <li><strong className="text-forest">Your activity</strong>: pages you opened, quiz scores and missed questions, and practice runs.</li>
              <li><strong className="text-forest">No account details</strong>. There is no registration form, and MINDSTEP never asks for your name, email address, or a password.</li>
            </ul>
          </CardBody>
        </Card>
      </section>

      <section aria-labelledby="not-h" className="mt-8">
        <h2 id="not-h" className="text-xl font-semibold text-forest">What we do not collect</h2>
        <Card className="mt-4">
          <CardBody className="pt-5">
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-mist">
              <li>No data about your mood, feelings, or mental state. Progress counts only what you open or complete.</li>
              <li>No outside analytics, advertising, or tracking scripts.</li>
              <li>No free-text &ldquo;how are you feeling?&rdquo; fields anywhere in the product.</li>
              <li>In local mode, nothing leaves the machine running the app.</li>
            </ul>
          </CardBody>
        </Card>
      </section>

      <section aria-labelledby="why-h" className="mt-8">
        <h2 id="why-h" className="text-xl font-semibold text-forest">Why we store it</h2>
        <p className="mt-3 text-sm leading-relaxed text-mist">
          So you can pick up where you left off: reopen a card, retry a quiz, and see your own
          progress. The same data powers your{" "}
          <Link href="/progress" className="underline">progress page</Link> and the suggestions on
          your <Link href="/learn" className="underline">dashboard</Link>. We never use it to
          judge, or pretend to judge, your wellbeing.
        </p>
      </section>

      <section aria-labelledby="delete-h" className="mt-8">
        <h2 id="delete-h" className="text-xl font-semibold text-forest">Your controls</h2>
        <Card className="mt-4">
          <CardBody className="pt-5">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-[15px] font-semibold text-forest">Delete my data</h3>
                <p className="mt-1 text-sm text-mist">
                  Erases everything tied to your current session: pages opened, quiz scores, and
                  practice runs. The session cookie keeps its id, but the record behind it is reset.
                  Nothing of yours remains.
                </p>
                {kind === "known" ? (
                  <div className="mt-3">
                    <DeleteDataButton />
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-mist">
                    You have no active session on this device, so there is nothing to delete here
                    yet.
                  </p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      <section aria-labelledby="access-rules-h" className="mt-8">
        <h2 id="access-rules-h" className="text-xl font-semibold text-forest">Who can see your data</h2>
        <p className="mt-3 text-sm leading-relaxed text-mist">
          Your progress is tied to your session cookie and looked up on the server only. No request
          from the browser can reach another visitor&apos;s record. There is no admin login or
          moderator account: content changes happen in the code and shipping process, not through a
          browser. The full access design, its limitations, and the production upgrade path are in
          docs/safety-and-privacy.md in the repository.
        </p>
      </section>

      <Callout tone="caution" title="Limits in this build (honest scope)" className="mt-8">
        This is a local-mode demo: single-file storage and no encryption at rest. It shows the
        design, not a certified production deployment. Read docs/limitations.md before assuming any
        clinical, legal, or compliance use.
      </Callout>
    </div>
  );
}
