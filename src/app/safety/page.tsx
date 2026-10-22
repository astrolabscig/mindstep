import Link from "next/link";
import { Callout } from "@/components/ui/callout";
import { Card, CardBody } from "@/components/ui/card";
import { ACCESSED_ON } from "@/content/references";
import { Art } from "@/components/visual/art";

export const metadata = {
  title: "Safety and crisis information",
};

const crisisContacts = [
  {
    name: "Immediate danger to life",
    phone: "112",
    note: "Ghana's national emergency number. Police, fire and ambulance. Call when someone is in immediate danger or has harmed themselves.",
  },
  {
    name: "National Mental Health and Suicide Prevention Helpline (MHA)",
    phone: "0800 678 678",
    note: "Free national call centre run by the Ghana Mental Health Authority. Confidential psychosocial support, including psychological first aid for suicidal thoughts. Launched in September 2022.",
  },
  {
    name: "A trusted person",
    phone: null,
    note: "If you can, also tell someone you trust: a family member, teacher, imam or church leader, or a health worker at the nearest clinic. You should not have to cope alone.",
  },
];

export default function SafetyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-forest">Safety and crisis information</h1>
          <p className="prose-readable max-w-2xl text-[15px] text-mist">
            MINDSTEP is educational, not a crisis service. Never let it delay a real call. Here is who to contact.
          </p>
        </div>
        <div className="w-full max-w-[140px] shrink-0">
          <Art name="safety-net" priority className="animate-float" />
        </div>
      </header>

      <Callout tone="safety" title="If you or someone near you is unsafe right now" className="mt-8">
        <p>
          Call <strong className="text-forest">112</strong> (emergency) or the free national
          helpline <strong className="text-forest">0800 678 678</strong> now. If someone has taken
          a harmful substance or injured themselves, go to the nearest hospital. Do not wait for
          an online answer.
        </p>
      </Callout>

      <section aria-labelledby="contacts-h" className="mt-10">
        <h2 id="contacts-h" className="text-xl font-semibold text-forest">Who to contact</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {crisisContacts.map((c) => (
            <li key={c.name}>
              <Card>
                <CardBody className="py-4">
                  <h3 className="text-[15px] font-semibold text-forest">{c.name}</h3>
                  {c.phone ? (
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-forest">
                      {c.phone}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm leading-relaxed text-mist">{c.note}</p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-mist">
          The full directory of hospitals, clinics, and helplines, with sources and verification
          dates, is on the <Link href="/support" className="underline">support page</Link>.
          Every number above was checked against official sources on {ACCESSED_ON}.
        </p>
      </section>

      <section aria-labelledby="limits-h" className="mt-10">
        <h2 id="limits-h" className="text-xl font-semibold text-forest">What MINDSTEP will not do</h2>
        <Card className="mt-4">
          <CardBody className="pt-5">
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-mist">
              <li>
                <strong className="text-forest">It does not monitor you.</strong> MINDSTEP has no
                crisis detection, no mood tracking, and no way to detect distress. No moderator and
                no algorithm watches your activity. If you are in crisis, the platform will not
                notice, and no one will be alerted.
              </li>
              <li>
                <strong className="text-forest">It does not diagnose.</strong> Quizzes only check
                what you remember from the material. They cannot identify any condition and are
                never a substitute for an assessment by a professional.
              </li>
              <li>
                <strong className="text-forest">It does not give medical advice.</strong> The
                cards explain general concepts (for example, what anxiety symptoms are called).
                Only a qualified health worker can advise on your situation or medication.
              </li>
              <li>
                <strong className="text-forest">It is not a treatment.</strong> Using MINDSTEP, or
                practising a conversation, can build understanding and skills. It does not replace
                therapy, medication, or support from a professional.
              </li>
            </ul>
          </CardBody>
        </Card>
      </section>

      <section aria-labelledby="if-worried-h" className="mt-10">
        <h2 id="if-worried-h" className="text-xl font-semibold text-forest">
          If you are worried about yourself or someone else
        </h2>
        <Card className="mt-4">
          <CardBody className="pt-5">
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-mist">
              <li>Call the free MHA helpline <strong className="text-forest">0800 678 678</strong> and describe what you are seeing. They can guide the next step.</li>
              <li>The <Link href="/learn/when-to-seek-help" className="underline">&ldquo;When professional help may be appropriate&rdquo;</Link> page explains common warning signs to take seriously, as education, not as a checklist that diagnoses anyone.</li>
              <li>Our <Link href="/topics#talking-helping" className="underline">talking and helping</Link> cards, and the <Link href="/scenarios" className="underline">practice conversations</Link>, give you ways to start the conversation without judgement.</li>
              <li>Write down what you want to ask, who you can call first, and what you want to say. A short note on your phone is enough.</li>
            </ul>
          </CardBody>
        </Card>
      </section>

      <Callout tone="note" title="Used MINDSTEP when you needed a person?" className="mt-10">
        That is okay. Call 0800 678 678. The people who answer are trained for moments like this,
        and the call is free and confidential.
      </Callout>

      <p className="mt-8 text-xs text-mist">
        Contact details verified {ACCESSED_ON}. See the{" "}
        <Link href="/research" className="underline">research &amp; references page</Link> for the
        source register and the <Link href="/support" className="underline">directory</Link> for
        per-service verification notes.
      </p>
    </div>
  );
}
