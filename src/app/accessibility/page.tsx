import { Card, CardBody } from "@/components/ui/card";
import { Callout } from "@/components/ui/callout";

export const metadata = { title: "Accessibility" };

const practices = [
  {
    title: "Works with a keyboard and screen reader",
    detail:
      "Every interactive element is reachable by keyboard with a visible focus outline. Headings follow a logical order, landmarks (nav, main, footer) are labelled, and dynamic updates use live regions so screen readers announce them. The mobile menu uses aria-expanded and aria-controls.",
  },
  {
    title: "Colour is not the only signal",
    detail:
      "Feedback, verification status, and scores always pair colour with text, such as \"latest 85%\" or \"not published\". The palette was chosen for contrast against background text (WCAG AA for body copy).",
  },
  {
    title: "Reduced motion is respected",
    detail:
      "Animation is decorative only. If your device is set to reduced motion, animated progress bars and section reveals become static.",
  },
  {
    title: "Readable content",
    detail:
      "Body text is at least 15px, with short line lengths and plain language. Jargon is explained where it appears, and metaphors are culturally familiar. Long pages use clear headings so you can skip ahead.",
  },
  {
    title: "Touch targets",
    detail:
      "Buttons and menu items are at least 44px, which matters on shared or older phones.",
  },
  {
    title: "Forms that help you recover",
    detail:
      "Fields have visible labels, hints, and inline error messages linked to the input, with no colour-only errors. Password fields use proper autocomplete hints so password managers work.",
  },
];

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-forest">Accessibility</h1>
        <p className="prose-readable max-w-2xl text-[15px] text-mist">
          MINDSTEP aims to meet WCAG 2.1 AA on the pages it ships. This page says what we did, and
          what we have not verified yet.
        </p>
      </header>

      <div className="mt-8 grid gap-4">
        {practices.map((p) => (
          <Card key={p.title}>
            <CardBody className="py-4">
              <h2 className="text-[15px] font-semibold text-forest">{p.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-mist">{p.detail}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Callout tone="caution" title="Honest status" className="mt-8">
        These practices are in the code, but this build has not had a formal audit with assistive
        technology users. Known gaps: the branching conversation runner relies on visual phase
        indicators that screen reader users may find hard to follow, and the colour contrast of
        small text on the dark footer has not been measured. See docs/limitations.md.
      </Callout>

      <p className="mt-8 text-sm text-mist">
        Found a barrier? Please report it in the repository. We treat accessibility fixes as bugs,
        not enhancements.
      </p>
    </div>
  );
}
