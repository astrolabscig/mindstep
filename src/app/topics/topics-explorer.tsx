"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  cardsByTheme,
  themes,
  type CardId,
  type ThemeId,
  type TopicCard,
} from "@/content/cards";
import { Art } from "@/components/visual/art";
import { TopicMark } from "@/components/visual/topic-mark";
import { ExplainerPlay } from "@/components/visual/explainer";
import { SpeakButton } from "@/components/ui/speak-button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DUR, EASE_OUT, SPRING } from "@/lib/motion";

/**
 * One theme at a time. The theme rail and the card tabs are the navigation:
 * choosing a theme or card swaps the message in place, so the page stays
 * short instead of becoming a long card scroll.
 */

const DEFAULT_THEME: ThemeId = "feeling-overwhelmed";

function firstCard(themeId: ThemeId): CardId {
  return cardsByTheme(themeId)[0]?.id ?? "overwhelmed-now";
}

export function TopicsExplorer() {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME);
  const [cardId, setCardId] = useState<CardId>(firstCard(DEFAULT_THEME));
  const reduceMotion = useReducedMotion();

  const theme = themes.find((item) => item.id === themeId) ?? themes[0];
  const themeCards = cardsByTheme(theme.id);
  const card = themeCards.find((item) => item.id === cardId) ?? themeCards[0];
  const themeIndex = themes.findIndex((item) => item.id === theme.id);
  const cardIndex = Math.max(0, themeCards.findIndex((item) => item.id === card.id));

  useEffect(() => {
    // Run after paint so a deep link can update the selected theme without
    // fighting React hydration or causing a cascading render in the effect.
    function applyHash() {
      const requested = window.location.hash.replace(/^#/, "");
      const match = themes.find((item) => item.id === requested);
      if (!match) return;
      setThemeId(match.id);
      setCardId(firstCard(match.id));
    }

    const frame = window.requestAnimationFrame(applyHash);
    window.addEventListener("hashchange", applyHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", applyHash);
    };
  }, []);

  function chooseTheme(nextTheme: ThemeId) {
    setThemeId(nextTheme);
    setCardId(firstCard(nextTheme));
    window.history.replaceState(null, "", `#${nextTheme}`);
  }

  function chooseCard(nextCard: CardId) {
    setCardId(nextCard);
    window.history.replaceState(null, "", `#${themeId}`);
  }

  function focusTab(event: KeyboardEvent<HTMLButtonElement>, ids: string[], index: number) {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;

    event.preventDefault();
    let next = index;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = ids.length - 1;
    else if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % ids.length;
    else next = (index - 1 + ids.length) % ids.length;

    document.getElementById(ids[next])?.focus();
    if (ids === themeTabIds) chooseTheme(themes[next].id);
    else chooseCard(themeCards[next].id);
  }

  const themeTabIds = themes.map((item) => `theme-${item.id}`);
  const cardTabIds = themeCards.map((item) => `card-tab-${item.id}`);

  return (
    <div className="mt-6 grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[268px_minmax(0,1fr)]">
      <div className="min-w-0 lg:sticky lg:top-24">
        <div className="mb-2 flex items-center justify-between gap-3 px-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mist">Choose a theme</p>
          <span className="hidden text-xs text-mist sm:block">{themes.length} themes</span>
        </div>

        <div
          role="tablist"
          aria-label="Themes"
          className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
        >
          {themes.map((item, index) => {
            const active = item.id === theme.id;
            const count = cardsByTheme(item.id).length;
            return (
              <button
                key={item.id}
                id={`theme-${item.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="topic-stage"
                tabIndex={active ? 0 : -1}
                onClick={() => chooseTheme(item.id)}
                onKeyDown={(event) => focusTab(event, themeTabIds, index)}
                className={cn(
                  "relative flex min-h-11 shrink-0 snap-start items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                  "focus-visible:outline-offset-2 lg:w-full",
                  active ? "text-white" : "text-forest hover:bg-white",
                )}
              >
                {active ? (
                  <motion.span
                    aria-hidden="true"
                    layoutId="active-theme"
                    className="absolute inset-0 rounded-2xl bg-forest shadow-[0_1px_2px_rgba(14,41,40,0.12)]"
                    transition={SPRING.snappy}
                  />
                ) : null}
                <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center">
                  <TopicMark theme={item.id} size="sm" />
                </span>
                <span className="relative z-10 min-w-0">
                  <span className="block whitespace-nowrap text-sm font-medium lg:whitespace-normal">
                    {item.title}
                  </span>
                  <span
                    className={cn(
                      "hidden text-xs lg:block",
                      active ? "text-white/65" : "text-mist",
                    )}
                  >
                    {count} {count === 1 ? "card" : "cards"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 hidden rounded-2xl bg-white/70 p-4 text-xs leading-relaxed text-mist ring-1 ring-hairline lg:block">
          Free exploration. Pick a card, read or listen, then take one small step. There is no
          right order.
        </p>
      </div>

      <div id="topic-stage" role="tabpanel" aria-labelledby={`theme-${theme.id}`} className="min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={theme.id}
            id={theme.id}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
            className="min-w-0 scroll-mt-24"
          >
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#e4f3ee] via-[#f1f9f5] to-[#f8fcfa] p-4 ring-1 ring-[#d3ebe4] sm:p-5">
            <div className="flex items-center gap-4">
              <div className="w-24 shrink-0 rounded-2xl bg-white/70 p-1.5 ring-1 ring-white sm:w-36">
                <Art name={theme.art} className="rounded-xl" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-600">
                  Theme {themeIndex + 1} of {themes.length}
                </p>
                <h2
                  id={`theme-heading-${theme.id}`}
                  className="mt-1 text-xl font-semibold tracking-[-0.02em] text-forest sm:text-2xl"
                >
                  {theme.title}
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-mist">{theme.line}</p>
              </div>
              <span className="ml-auto hidden shrink-0 self-start rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-forest-700 ring-1 ring-white sm:inline-flex">
                {themeCards.length} {themeCards.length === 1 ? "card" : "cards"}
              </span>
            </div>
          </div>

          {themeCards.length > 1 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                In this theme
              </span>
              <div role="tablist" aria-label={`Cards in ${theme.title}`} className="flex flex-wrap gap-2">
                {themeCards.map((item, index) => {
                  const active = item.id === card.id;
                  return (
                    <button
                      key={item.id}
                      id={`card-tab-${item.id}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="topic-card"
                      tabIndex={active ? 0 : -1}
                      onClick={() => chooseCard(item.id)}
                      onKeyDown={(event) => focusTab(event, cardTabIds, index)}
                      className={cn(
                        "relative min-h-9 max-w-full rounded-full px-3.5 py-1.5 text-left text-sm font-medium transition-colors",
                        active ? "text-forest" : "bg-white/70 text-mist ring-1 ring-hairline hover:text-forest",
                      )}
                    >
                      {active ? (
                        <motion.span
                          aria-hidden="true"
                          layoutId="active-card-tab"
                          className="absolute inset-0 rounded-full bg-sage/55"
                          transition={SPRING.snappy}
                        />
                      ) : null}
                      <span className="relative z-10 block truncate">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <p className="sr-only" aria-live="polite">
            {theme.title}: {card.title}
          </p>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={card.id}
              id="topic-card"
              role="tabpanel"
              aria-labelledby={themeCards.length > 1 ? cardTabIds[cardIndex] : `theme-heading-${theme.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: DUR.fast, ease: EASE_OUT }}
              className="mt-4"
            >
              <TopicCardView card={card} index={cardIndex} total={themeCards.length} />
            </motion.div>
          </AnimatePresence>
        </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TopicCardView({ card, index, total }: { card: TopicCard; index: number; total: number }) {
  return (
    <Card className="overflow-hidden card-lift" data-testid={`card-${card.id}`}>
      <CardBody className="px-5 pb-5 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info">Card {index + 1} of {total}</Badge>
          <span className="text-xs text-mist">About a minute to read</span>
        </div>

        <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-forest sm:text-2xl">
          {card.title}
        </h3>
        <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink sm:text-base">{card.point}</p>
        <p className="mt-2 text-sm leading-relaxed text-mist">{card.why}</p>

        {card.theme === "mental-health-issues" ? (
          <p className="mt-3 rounded-2xl bg-[#faf3dc]/75 px-3.5 py-2.5 text-xs leading-relaxed text-[#7d621a] ring-1 ring-[#f0e2b0]">
            <strong className="font-semibold">Educational overview, not a diagnosis.</strong>{" "}
            Only a trained health professional can assess a condition.
          </p>
        ) : null}

        {card.motion ? (
          <div className="mt-5 border-t border-hairline pt-4">
            <ExplainerPlay name={card.motion} altLabel={card.title} className="w-full" />
          </div>
        ) : (
          <div className="mt-5 rounded-2xl bg-mint-100/60 p-2 ring-1 ring-hairline-soft">
            <Art name={card.art} className="max-h-56 rounded-xl sm:max-h-64" />
          </div>
        )}

        <details className="group mt-4 rounded-2xl bg-canvas/90 px-4 py-3 ring-1 ring-hairline-soft">
          <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-quietblue-600">
            <span className="group-open:hidden">What you can do today</span>
            <span className="hidden group-open:inline">Hide the steps</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <ol className="mt-3 flex flex-col gap-2.5">
            {card.steps.map((step, stepIndex) => (
              <li key={stepIndex} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-full bg-sage/50 text-xs font-bold text-forest"
                >
                  {stepIndex + 1}
                </span>
                <span className="text-sm leading-relaxed text-ink">{step}</span>
              </li>
            ))}
          </ol>
          {card.ifYou ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-mist">
              <Badge tone="info">If this sounds like you</Badge>
              <span>{card.ifYou}</span>
            </div>
          ) : null}
          <p className="mt-3 border-t border-hairline pt-2 text-xs text-mist">{card.source}</p>
        </details>

        <div className="mt-3 flex items-center justify-between gap-3">
          <SpeakButton text={card.voiceScript} src={`/voice/cards/${card.id}.mp3`} />
          <span className="text-xs text-mist">
            ~{Math.round(card.voiceScript.split(/\s+/).length / 2.4)}s listen
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
