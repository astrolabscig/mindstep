import Link from "next/link";
import { references, ACCESSED_ON } from "@/content/references";
import { Card, CardBody } from "@/components/ui/card";
import { Callout } from "@/components/ui/callout";
import { Art } from "@/components/visual/art";

export const metadata = { title: "Research and references" };

/**
 * Claim-to-source mapping mirrored from docs/health-references.md.
 * Every claim in product copy cites one of these registers.
 */
const claims: { id: string; claim: string; where: string }[] = [
  {
    id: "R1",
    claim: "Ghana is adding mental health care to the national health insurance scheme. Cost and access are still real barriers, but the system is changing.",
    where: "Cards on getting help · support directory",
  },
  {
    id: "R2",
    claim: "Online mental health education improves what young people know (a moderate effect, SMD of about 0.70). It did not significantly change stigma or the intention to ask for help. MINDSTEP claims knowledge gains, not attitude change.",
    where: "Landing page · topic cards",
  },
  {
    id: "R3",
    claim: "In a district survey in Ghana, most people endorsed stigmatising views about danger and contagion. Shame and structural barriers predicted whether people asked for help. The myth cards use these themes.",
    where: "Myth cards · talking and helping cards",
  },
  {
    id: "R4",
    claim: "Ghana's mental health system is concentrated in a few facilities, including three psychiatric hospitals with regional roles. The directory shows what exists rather than claiming to list everything.",
    where: "Support directory",
  },
  {
    id: "R5/R6",
    claim: "The national helpline 0800 678 678 was launched by the Mental Health Authority in September 2022 for psychosocial support, including for suicidal thoughts.",
    where: "Safety page · support directory",
  },
  {
    id: "R7/R8",
    claim: "Service listings are checked against the MHA website and an independent helpline index. If we cannot confirm something, we mark it as awaiting verification instead of making it up.",
    where: "Each directory entry",
  },
  {
    id: "R9/R10",
    claim: "WHO standards for adolescent care inform the app's tone and its guidance on privacy and support without judgement.",
    where: "Practice conversations · support directory",
  },
  {
    id: "R13",
    claim: "Mental disorders are common health conditions that can be treated, and many people do not receive care. The condition overviews describe patterns, not a checklist or a diagnosis.",
    where: "Mental health issues theme · eating disorders card",
  },
  {
    id: "R14",
    claim: "Depression is more than ordinary sadness: it can involve persistent low mood or loss of interest, with changes in sleep, appetite, energy and concentration. It is treatable.",
    where: "Depression card · why low mood can look like withdrawal",
  },
  {
    id: "R15",
    claim: "Anxiety disorders involve excessive fear or worry that persists and interferes with daily life; panic and avoidance are common. Avoidance maintains fear, and treatment helps.",
    where: "Anxiety card · why we avoid",
  },
  {
    id: "R16",
    claim: "After trauma, flashbacks, nightmares, numbness, hypervigilance and avoidance are common responses, not weakness. Trauma-informed support can help without forcing someone to retell everything.",
    where: "Trauma and PTSD card",
  },
  {
    id: "R17",
    claim: "Bipolar disorder involves episodes of low mood and unusually high energy, irritability or reduced need for sleep. It is not the same as ordinary mood swings.",
    where: "Bipolar disorder card",
  },
  {
    id: "R18",
    claim: "OCD involves unwanted intrusive thoughts and rituals or checking that aim to reduce distress. It is not simply a preference for order; CBT with exposure and response prevention helps.",
    where: "OCD card",
  },
  {
    id: "R19",
    claim: "Psychosis can involve hallucinations, unusual beliefs, confusion or withdrawal. It is treatable, early help matters, and a person is not defined by dangerousness.",
    where: "Psychosis card",
  },
  {
    id: "R20",
    claim: "Harmful substance use and dependence are health issues, not moral failure. Some withdrawals can be dangerous, so stopping alcohol or sedatives suddenly without medical advice is risky.",
    where: "Substance use card · why we cope in costly ways",
  },
  {
    id: "R21",
    claim: "Stress can trigger fight, flight, freeze or fawn responses. These are survival responses, not character flaws; naming them and slowing the body can help.",
    where: "Why we react theme · why we snap or shut down",
  },
];

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-forest">Research and references</h1>
          <p className="prose-readable max-w-2xl text-[15px] text-mist">
            Every health claim in MINDSTEP links to a published source. The original register was
            checked on {ACCESSED_ON}; condition and mechanism sources were added and checked on 21
            Oct 2026. This page lists them.
          </p>
        </div>
        <Art name="research-notes" priority className="w-full max-w-[160px] shrink-0" />
      </header>

      <section aria-labelledby="sources-h" className="mt-8">
        <h2 id="sources-h" className="text-xl font-semibold text-forest">Source register</h2>
        <ol className="mt-4 flex flex-col gap-3">
          {references.map((r) => (
            <li key={r.id}>
              <Card>
                <CardBody className="py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-quietblue-600">
                    {r.id} · {r.institution} · {r.year}
                  </p>
                  <h3 className="mt-1 text-[15px] font-semibold leading-snug text-forest">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-xs text-mist">
                    Accessed {r.accessDate} ·{" "}
                    <a href={r.url} className="underline hover:text-forest" rel="noreferrer noopener" target="_blank">
                      view source
                    </a>
                  </p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="claims-h" className="mt-10">
        <h2 id="claims-h" className="text-xl font-semibold text-forest">Where each source is used</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {claims.map((c) => (
            <li key={c.id}>
              <Card>
                <CardBody className="py-4">
                  <p className="text-xs font-semibold text-quietblue-600">{c.id}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{c.claim}</p>
                  <p className="mt-1 text-xs text-mist">Used in: {c.where}</p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <Callout tone="caution" title="What the evidence supports, and what it does not" className="mt-10">
        Educational programmes can reliably raise knowledge. Evidence that they change stigma or
        lead people to ask for help on their own is weak, so MINDSTEP pairs cards with practice
        conversations rather than promising attitude change. The full claim mapping and
        verification notes are in docs/research.md and docs/health-references.md in the repository.
      </Callout>

      <p className="mt-8 text-sm text-mist">
        Related on this site: <Link href="/safety" className="underline">safety and crisis information</Link> ·{" "}
        <Link href="/support" className="underline">support directory</Link> ·{" "}
        <Link href="/accessibility" className="underline">accessibility</Link>
      </p>
    </div>
  );
}
