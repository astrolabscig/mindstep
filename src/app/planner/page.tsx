import Link from "next/link";
import { currentProfile } from "@/lib/server/profile";
import { PlannerBoard } from "./planner-board";
import { Callout } from "@/components/ui/callout";
import { ButtonLink } from "@/components/ui/button";
import { Art } from "@/components/visual/art";

export const dynamic = "force-dynamic";

export const metadata = { title: "Plan your next step" };

export default async function PlannerPage() {
  const { kind, profile } = await currentProfile();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-forest">Plan your next step</h1>
          <p className="prose-readable max-w-2xl text-[15px] text-mist">
            Turn what you read into small, doable steps. Only the actions you add appear here.
          </p>
          {kind === "known" && profile?.onboarding ? (
            <p className="text-sm text-mist">
              You said your goal was{" "}
              <strong className="text-forest">{goalLabel(profile.onboarding.goal)}</strong>. The
              starters below are picked to match.
            </p>
          ) : null}
        </div>
        <Art name="plan-steps" priority className="w-full max-w-[150px] shrink-0 animate-float" />
      </header>

      {kind === "anonymous" ? (
        <Callout tone="note" title="Guest mode" className="mt-6">
          You can add actions right away. They save to this browser session.{" "}
          <Link href="/account" className="underline">Create an account</Link> to keep them.
        </Callout>
      ) : null}

      <div className="mt-8">
        <PlannerBoard items={profile?.actions ?? []} />
      </div>

      {/* Suggested starters. Explainable and activity-based, not diagnostic */}
      <section aria-labelledby="starters-h" className="mt-10">
        <h2 id="starters-h" className="text-xl font-semibold text-forest">Suggested starters</h2>
        <p className="mt-1 text-sm text-mist">
          Ideas that fit common next steps. Add one if it helps, and skip anything that doesn&apos;t.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {STARTERS.map((s) => (
            <li key={s.title}>
              <div className="rounded-card bg-white p-4 ring-1 ring-forest-100">
                <h3 className="text-sm font-semibold text-forest">{s.title}</h3>
                <p className="mt-1 text-sm text-mist">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <ButtonLink href="/scenarios" size="sm" variant="secondary">Practise a conversation first</ButtonLink>
          <ButtonLink href="/support" size="sm" variant="quiet">Find support</ButtonLink>
        </div>
      </section>

      <Callout tone="caution" title="What the planner is not" className="mt-10">
        It is a simple to-do list. Nothing more. It cannot contact anyone, remind you of
        appointments, or assess your situation. If you need someone to talk to now, call the free
        national helpline <strong className="text-forest">0800 678 678</strong>.
      </Callout>
    </div>
  );
}

function goalLabel(goal: string): string {
  switch (goal) {
    case "self-understanding": return "understanding yourself";
    case "support-others": return "supporting someone";
    case "find-services": return "finding services";
    case "school-work": return "school or work wellbeing";
    default: return "exploring the material";
  }
}

const STARTERS = [
  {
    title: "Identify one trusted person",
    description: "Name the person you could talk to if things got heavy, and one reason you trust them.",
  },
  {
    title: "Prepare questions for a health worker",
    description: "Write down two questions you want answered at a first visit, such as \"What happens next?\" and \"What will this cost with NHIS?\"",
  },
  {
    title: "Plan a conversation",
    description: "Choose when, where, and how you will raise a mental health topic with someone you care about. Use practice conversations to rehearse.",
  },
  {
    title: "Revisit a card",
    description: "Open a card you read before and try one step you skipped.",
  },
] as const;
