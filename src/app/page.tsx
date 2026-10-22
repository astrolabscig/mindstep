import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { cards, themes } from "@/content/cards";
import { supportServices } from "@/content/support-services";
import { ScenarioPreview } from "@/components/landing/scenario-preview";
import { ExplainerPlay } from "@/components/visual/explainer";
import { Art } from "@/components/visual/art";
import { SectionReveal } from "@/components/ui/section-reveal";
import { SupportPreview } from "@/components/landing/support-preview";

export const metadata = {
  title: "MINDSTEP. Mental health information and support for Ghana",
};

const learningLoop = [
  {
    step: "Start with one card",
    title: "Short, plain cards",
    body: `${cards.length} cards across ${themes.length} themes, including why we react and common mental health issues. Read one in a minute, or listen to it.`,
  },
  {
    step: "Practise the words",
    title: "Try a real situation",
    body: "Choose what you would say. Your choice moves the story, and the feedback explains what happened.",
  },
  {
    step: "Take one next step",
    title: "Leave with something to do",
    body: "A free call, a clinic visit, or a plan for tonight. Small enough to do today.",
  },
];

export default function LandingPage() {
  const verifiedServices = supportServices.filter((s) => s.verification.status === "verified").length;
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-mint-200/80 bg-gradient-to-b from-[#e4f3ee] via-[#f1f8f5] to-canvas">
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="prose-readable max-w-2xl">
              <Badge tone="neutral">Free · Based on evidence · Made for Ghana</Badge>
              <h1 className="mt-4 text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] text-forest sm:text-6xl">
                Start where it hurts. Leave with one small step.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-mist">
                {cards.length} short cards on overwhelm, low mood, worry, sleep, why we react,
                common mental health issues, and getting help. Read one, hear it, or practise what
                you&apos;d say. Free, and open to anyone.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/topics" variant="primary" size="lg">
                  What&apos;s on your mind?
                </ButtonLink>
                <ButtonLink href="/support" variant="secondary" size="lg">
                  Find support
                </ButtonLink>
              </div>
              <p className="mt-5 text-sm text-mist">
                The national Mental Health Authority helpline <strong className="text-forest-700">0800 678 678</strong> is free.
                In immediate danger, call <strong className="text-forest-700">112</strong>.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm">
              <Art name="hero-calm" priority className="mx-auto mb-4 max-w-[320px] drop-shadow-sm" />
              <div className="rounded-feature bg-white p-4 shadow-card ring-1 ring-hairline">
                <ExplainerPlay name="loop" altLabel="how MINDSTEP works" />
                <p className="mt-2 text-center text-xs text-mist">
                  Understand one idea. Practise the words. Take one real step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The loop */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionReveal className="grid items-end gap-6 md:grid-cols-[1fr_260px]">
          <div>
            <h2 className="text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-forest sm:text-4xl">
              How MINDSTEP works
            </h2>
            <p className="prose-readable mt-3 text-[15px] leading-relaxed text-mist">
              Three simple moves. You can start anywhere, in any order.
            </p>
          </div>
          <Art name="loop" className="hidden w-full max-w-[260px] justify-self-end md:block" />
        </SectionReveal>
        <SectionReveal className="mt-10 grid gap-5 md:grid-cols-3">
          {learningLoop.map((item, i) => (
            <Card key={item.step} className="h-full">
              <CardBody className="pt-5">
                <span aria-hidden="true" className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-mint-100 text-sm font-semibold text-teal-600 ring-1 ring-mint-200">
                  {i + 1}
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider text-quietblue-600">{item.step}</p>
                <h3 className="mt-2 text-lg font-semibold text-forest">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{item.body}</p>
              </CardBody>
            </Card>
          ))}
        </SectionReveal>
      </section>

      {/* Scenario preview. Interactive */}
      <section className="border-y border-forest-100 bg-quietblue/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionReveal>
            <h2 className="text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-forest sm:text-4xl">
              Try a real conversation
            </h2>
            <p className="prose-readable mt-3 text-[15px] text-mist">
              One scene from the practice lab. In the app, your choices branch, and every route ends with a next step.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1} className="mt-8">
            <ScenarioPreview />
          </SectionReveal>
        </div>
      </section>

      {/* Support navigator preview */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <SectionReveal>
            <h2 className="text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-forest sm:text-4xl">
              Support that shows where it comes from
            </h2>
            <p className="prose-readable mt-3 text-[15px] leading-relaxed text-mist">
              Every service lists the date we last checked it and where the information came from. If we cannot confirm a number, we leave it out.
            </p>
            <Art name="support-connection" className="mt-5 max-w-[220px]" />
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3">
                <Badge tone="positive">{verifiedServices} checked</Badge>
                <span className="text-mist">against official sources on 18 Oct 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="warning">still checking</Badge>
                <span className="text-mist">we never guess a phone number</span>
              </div>
            </div>
            <div className="mt-8">
              <ButtonLink href="/support" variant="primary">Find support</ButtonLink>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.12}>
            <SupportPreview />
          </SectionReveal>
        </div>
      </section>

      {/* Modules */}
      <section className="border-y border-forest-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionReveal>
            <h2 className="text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-forest sm:text-4xl">Pick a theme, or start anywhere</h2>
            <p className="prose-readable mt-3 text-[15px] text-mist">
              {themes.length} themes, short cards, voice on every one. No sequence, no scores.
            </p>
          </SectionReveal>
          <SectionReveal className="mt-10 grid gap-4 sm:grid-cols-2">
            {themes.slice(0, 6).map((t) => (
              <Link key={t.id} href={`/topics#${t.id}`} className="group block focus-visible:outline-3 focus-visible:outline-quietblue-600">
                <Card className="h-full transition hover:ring-forest-500 group-hover:ring-forest-500">
                  <CardBody className="pt-5">
                    <Art name={t.art} className="mb-4 h-40 rounded-xl bg-mint-50/60" />
                    <h3 className="mt-2 text-lg font-semibold text-forest">{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{t.line}</p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </SectionReveal>
          <div className="mt-6">
            <ButtonLink href="/topics" variant="quiet">See all {themes.length} themes</ButtonLink>
          </div>
        </div>
      </section>

      {/* Responsible use */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionReveal>
          <Callout tone="safety" title="What MINDSTEP is not">
            MINDSTEP is educational. It is not a diagnosis, therapy, or a monitored crisis service,
            and it cannot tell you what condition anyone has. It does not watch what you do. If
            there is immediate danger to life, call <strong>112</strong>. For free, confidential
            support, call the Mental Health Authority on <strong>0800 678 678</strong>.
          </Callout>
        </SectionReveal>
      </section>

      {/* Research. Pointer only; full bibliography lives on /research */}
      <section id="research" className="border-t border-forest-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_240px]">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-forest">Where the facts come from</h2>
              <p className="prose-readable mt-3 max-w-2xl text-sm leading-relaxed text-mist">
                Every health claim links to a published source, with the date we checked it. The full
                bibliography lives on one page.
              </p>
              <div className="mt-5">
                <ButtonLink href="/research" variant="quiet">Read the sources</ButtonLink>
              </div>
            </div>
            <Art name="research-notes" className="hidden w-full max-w-[240px] justify-self-end md:block" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-4 text-center sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-forest">Where would you like to start?</h2>
        <p className="prose-readable mx-auto mt-2 text-[15px] text-mist">
          Free, with no account needed. Pick a topic, or just listen.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/topics" size="lg" variant="primary">Browse the topics</ButtonLink>
        </div>
      </section>
    </>
  );
}
