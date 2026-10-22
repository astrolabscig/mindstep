import { cards, themes } from "@/content/cards";
import { Botanical } from "@/components/visual/botanical";
import { TopicsExplorer } from "./topics-explorer";

/**
 * Topics. Free exploration. No levels, no sequence, no progress bars:
 * enter anywhere, choose one theme, leave with something to do.
 *
 * The page stays short by showing one theme and one card at a time; the
 * theme rail and card tabs are the navigation, not anchor links.
 */

export const metadata = { title: "Topics" };

export default function TopicsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#e4f3ee] via-[#f1f9f5] to-[#f7fbf9] px-5 py-7 ring-1 ring-[#d3ebe4] sm:px-8 sm:py-9">
        <Botanical />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-600">
              Topics · free exploration
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-forest sm:text-[2.6rem]">
              What&apos;s on your mind today?
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mist sm:text-base">
              Pick a theme. One card at a time, with the message up front. Read it, hear it, or
              open one small step.
            </p>
          </div>

          <dl className="flex shrink-0 gap-2.5" aria-label="Topics at a glance">
            <div className="rounded-2xl bg-white/75 px-4 py-3 ring-1 ring-white">
              <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-mist">Themes</dt>
              <dd className="mt-0.5 text-xl font-semibold text-forest">{themes.length}</dd>
            </div>
            <div className="rounded-2xl bg-white/75 px-4 py-3 ring-1 ring-white">
              <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-mist">Cards</dt>
              <dd className="mt-0.5 text-xl font-semibold text-forest">{cards.length}</dd>
            </div>
            <div className="rounded-2xl bg-forest px-4 py-3 text-white">
              <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">Cost</dt>
              <dd className="mt-0.5 text-xl font-semibold text-sage">Free</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-white/80 px-4 py-3 text-sm text-mist ring-1 ring-hairline">
        <span className="font-semibold text-forest">New here?</span>
        <span>Start with</span>
        <a href="#why-we-react" className="font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-forest">
          why we react
        </a>
        <span>or</span>
        <a href="#mental-health-issues" className="font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-forest">
          common mental health issues
        </a>
        <span>.</span>
      </div>

      <TopicsExplorer />
    </div>
  );
}
