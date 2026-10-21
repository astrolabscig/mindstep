import { cn } from "@/lib/utils";
import { type ExplainName } from "./explainers";

/**
 * Stage renderer for motion explainers.
 *
 * Pure DOM + CSS (no media playback, no WebGL): soft green planes, rounded shapes and
 * gentle transitions, so every scene is a coherent sibling of the app's
 * illustration system. Everything here is decorative (aria-hidden), the
 * captions and voice carry the meaning. With `prefers-reduced-motion`,
 * transitions/animations collapse to a static (stage-0) frame via CSS.
 */

export function ExplainerStage({
  name,
  step,
  className,
}: {
  name: ExplainName;
  /** Current stage index; 0 = initial/neutral frame. */
  step: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-2xl bg-forest-100 ring-1 ring-[#dcebe8]",
        className,
      )}
      data-testid={`explain-scene-${name}`}
      data-step={step}
    >
      {SCENES[name]?.(step) ?? null}
    </div>
  );
}

/*
 * Shared palette per scene:
 *   ground/tone  #e4f7d2 · #dcebe8      shapes  #b8f28b · #96d45f
 *   ink          #16403d / #2b6360      paper   #ffffff / #f6f8f5
 */

const paperCard =
  "rounded-xl bg-white ring-1 ring-[#e1eee9] transition-all duration-700 ease-out";

const SCENES: Record<ExplainName, (step: number) => React.ReactNode> = {
  /* Slow exhale: concentric breathing rings + a label that alternates. */
  breathe: (step) => (
    <div className="absolute inset-0 grid place-items-center">
      <span className="absolute h-32 w-32 rounded-full bg-sage/30 animate-motion-ring [animation-delay:0s]" />
      <span className="absolute h-32 w-32 rounded-full bg-sage/20 animate-motion-ring [animation-delay:1.1s]" />
      <span className="absolute h-32 w-32 rounded-full bg-sage/10 animate-motion-ring [animation-delay:2.2s]" />
      <span
        className={cn(
          "grid h-20 w-20 place-items-center rounded-full bg-forest text-[11px] font-semibold text-sage",
          "transition-transform duration-1000 ease-in-out animate-motion-breath",
        )}
      >
        {step === 0 ? "in" : "out"}
      </span>
      <span className="absolute bottom-2.5 right-3 text-[11px] font-medium text-forest-700">
        slow exhale
      </span>
    </div>
  ),

  /* Too much at once → park it on paper. */
  overwhelm: (step) => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative grid w-40 gap-2">
        {[
          { label: "deadlines", base: "-rotate-2", parked: "opacity-0 -translate-y-3" },
          { label: "group chat", base: "rotate-1", parked: "opacity-0 translate-y-3" },
          { label: "the one worry", base: "", parked: "" },
        ].map((row, i) => (
          <div
            key={row.label}
            className={cn(
              paperCard,
              "flex items-center gap-2 bg-white/95 px-3 py-2 shadow-[0_1px_2px_rgba(14,41,40,0.06)]",
              step === 0 ? `${row.base} animate-motion-jitter` : "",
              step >= 1 && row.label !== "the one worry" ? row.parked : "",
              step === 1 && row.label === "the one worry" ? "scale-105 ring-forest-500" : "",
            )}
            style={step === 0 ? { animationDelay: `${i * 0.25}s` } : undefined}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sage-strong" />
            <span className="text-[11px] font-medium text-forest-700">{row.label}</span>
            {step >= 2 && row.label === "the one worry" ? (
              <span className="ml-auto rounded-full bg-sage/50 px-2 py-0.5 text-[10px] font-bold text-forest-900">parked</span>
            ) : null}
          </div>
        ))}
      </div>
      <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-forest-700">
        {step === 0 ? "all at once" : step === 1 ? "one at a time" : "on paper"}
      </span>
    </div>
  ),

  /* Low mood: sun on the horizon + a five-minute path. */
  "breath-lows": (step) => (
    <div className="absolute inset-0">
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-sage/40" />
      <div
        className={cn(
          "absolute left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-sage-strong shadow-[0_0_0_18px_rgba(150,212,95,0.15)]",
          "transition-all duration-1000 ease-out",
          step >= 1 ? "bottom-[calc(33%-2rem)]" : "bottom-[calc(33%-4.5rem)] opacity-70",
        )}
      />
      <div
        className={cn(
          "absolute bottom-[calc(33%-3px)] w-10 border-t-2 border-dashed border-forest/70 transition-all duration-1000",
          step >= 1 ? "w-44" : "w-12",
        )}
        style={{ left: "16%" }}
      />
      <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-forest-700">
        {step === 0 ? "flat horizon" : "five minutes outside"}
      </span>
    </div>
  ),

  /* Drifting attention → noticing → back. */
  "worry-locate": (step) => (
    <div className="absolute inset-0 grid place-items-center">
      <span className="absolute h-28 w-28 rounded-full border-2 border-dashed border-forest/40" />
      <span className="absolute grid h-12 w-12 place-items-center rounded-full bg-forest text-[10px] font-bold text-sage">
        here
      </span>
      {[0, 1, 2].map((i) => {
        const drifting = step === 0;
        return (
          <span
            key={i}
            className={cn(
              "absolute h-3.5 w-3.5 rounded-full bg-forest-600 transition-all duration-1000 ease-in-out",
              drifting ? "animate-motion-drift" : "",
            )}
            style={
              drifting
                ? { animationDelay: `${i * 0.9}s` }
                : {
                    top: "calc(50% - 7px)",
                    left: "calc(50% - 7px)",
                    transform: "translate(0, -38px)",
                    opacity: step >= 2 ? 1 : 0.6,
                    transitionDelay: `${i * 0.2}s`,
                  }
            }
          />
        );
      })}
      <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-forest-700">
        {step === 0 ? "drifted" : step === 1 ? "notice" : "bring it back"}
      </span>
    </div>
  ),

  /* Side-by-side conversation, open question, listening. */
  conversation: (step) => (
    <div className="absolute inset-0 grid place-items-center">
      <div
        className={cn(
          paperCard,
          "bg-white px-3 py-2 text-[11px] font-medium text-forest-700",
          step >= 1 ? "-translate-y-2 opacity-100" : "opacity-80",
        )}
        style={{ marginBottom: step >= 2 ? "2.6rem" : "1.4rem" }}
      >
        &ldquo;How are you, really?&rdquo;
      </div>
      <div className="flex items-center gap-2">
        <span className="h-9 w-9 rounded-full bg-forest-600" />
        <span className={cn("h-1.5 w-10 rounded-full bg-forest/50 transition-all duration-700", step >= 2 && "animate-motion-pulse")} />
        <span className={cn("h-9 w-9 rounded-full bg-sage-strong transition-transform duration-700", step >= 2 && "scale-110")} />
      </div>
      <span
        className={cn(
          "absolute bottom-2.5 left-3 text-[11px] font-medium text-forest-700 transition-opacity duration-500",
          step >= 2 ? "opacity-100" : "opacity-0",
        )}
      >
        listening &gt; fixing
      </span>
    </div>
  ),

  /* Heavy day → put the bag down → just the next hour. */
  "young-person": (step) => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative flex flex-col items-center">
        <span className="h-12 w-12 rounded-full bg-forest" />
        <span className="h-14 w-20 rounded-t-3xl bg-forest-700" />
        <span
          className={cn(
            "absolute -right-9 top-6 rounded-lg bg-white px-2.5 py-3 ring-1 ring-[#e1eee9] shadow-[0_2px_4px_rgba(14,41,40,0.12)]",
            "transition-all duration-700 ease-in-out",
            step >= 1 ? "translate-x-3 rotate-6 translate-y-4 opacity-0" : "animate-motion-jitter",
          )}
          aria-hidden="true"
        >
          <span className="block h-2 w-8 rounded-full bg-sage" />
          <span className="mt-1 block h-2 w-6 rounded-full bg-sage/60" />
        </span>
      </div>
      <span
        className={cn(
          "absolute -right-6 top-2 text-sage-strong transition-all duration-500",
          step >= 1 ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      >
        ✦
      </span>
      <span className="absolute bottom-2.5 right-3 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-forest-700 ring-1 ring-[#e1eee9]">
        {step < 2 ? "today" : "just this hour"}
      </span>
    </div>
  ),

  /* Understand → practise → next step. */
  loop: (step) => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex items-center gap-3">
        {["understand", "practise", "next step"].map((label, i) => (
          <span key={i} className="flex items-center gap-3">
            <span
              className={cn(
                "grid h-16 w-16 place-items-center rounded-full px-1 text-center text-[10px] font-bold leading-tight transition-all duration-700",
                i === 0 ? "bg-forest text-sage" : "bg-white text-forest-700 ring-1 ring-[#e1eee9]",
                step === i + 1 && i === 1 ? "scale-110 bg-forest text-sage ring-forest" : "",
                step === i + 1 && i === 2 ? "scale-110 bg-forest text-sage ring-forest" : "",
                step === 0 && i > 0 ? "" : "",
              )}
            >
              {label}
            </span>
            {i < 2 ? (
              <span
                className={cn(
                  "h-1 w-6 rounded-full bg-forest/30 transition-all duration-700",
                  step > i ? "bg-forest" : "",
                )}
              />
            ) : null}
          </span>
        ))}
      </div>
      <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-forest-700">
        three moves
      </span>
    </div>
  ),
};
