"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DUR, EASE_OUT } from "@/lib/motion";
import { MOTION, motionVoicePath, type ExplainName } from "./explainers";
import { ExplainerStage } from "./explainer-stage";

/**
 * An illustrated explainer: professional unDraw scene + stage captions + voice.
 *
 * Reads its layout no-JS: on a server render you get stage 0 with the play
 * control; clicking advances the scene and plays the bundled voice-over.
 * Audio: bundled MP3 (offline Piper render) → device speech synthesis if
 * the file is missing → silent no-op. Never anything remote.
 */

const emptySubscribe = () => () => {};
function supportSnapshot() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
function supportServerSnapshot() {
  return false;
}

export function ExplainerPlay({
  name,
  className,
  altLabel,
}: {
  name: ExplainName;
  className?: string;
  altLabel?: string;
}) {
  const spec = MOTION[name];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ttsSupported = useSyncExternalStore(emptySubscribe, supportSnapshot, supportServerSnapshot);

  // No-JS / reduced-motion keeps a real-looking single stage.
  useEffect(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setStep((s) => (s + 1) % spec.steps.length);
    }, 3200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [spec, playing]);

  if (!spec) return null;

  function stop() {
    setPlaying(false);
    setStep(0);
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  async function start() {
    setPlaying(true);
    setStep(0);
    const src = motionVoicePath(name);
    try {
      const el = audioRef.current ?? new Audio(src);
      el.src = src;
      el.currentTime = 0;
      el.play().catch(() => {
        // Pausing or navigating while the request is pending is not an error.
        // The captions still carry the lesson if playback is blocked.
      });
      el.onended = () => stop();
      audioRef.current = el;
    } catch {
      // Bundled file missing → fall back to the device voice, then to silence.
      if (ttsSupported) {
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(spec.script);
          window.speechSynthesis.speak(u);
        } catch {
          /* captions carry the content on their own */
        }
      }
    }
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-full">
        <ExplainerStage name={name} step={playing ? step : 0} className="h-44 w-full" />
      </div>
      <div aria-live="polite" className="mt-2 flex min-h-5 items-center justify-center" data-testid={`explain-caption-${name}`}>
        <AnimatePresence mode="wait" initial={false}>
          {playing ? (
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.instant, ease: EASE_OUT }}
              className="text-center text-xs font-medium text-forest-700"
            >
              {spec.steps[step].caption}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => (playing ? stop() : void start())}
          className="min-h-9 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-forest ring-1 ring-[#e1eee9] transition hover:ring-forest-500"
          aria-label={playing ? `Pause the ${altLabel ?? name} explainer` : `How it works: play the ${altLabel ?? name} explainer with voice`}
        >
          <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] font-bold text-sage">
            {playing ? "II" : "▶"}
          </span>
          {playing ? "Pause" : "How it works"}
        </button>
        <span aria-hidden="true" className={cn("flex gap-1", playing ? "" : "opacity-40")}>
          {spec.steps.map((_, i) => (
            <span key={i} className={cn("h-1 w-4 rounded-full", i === (playing ? step : 0) ? "bg-forest" : "bg-forest/20")} />
          ))}
        </span>
      </div>
    </div>
  );
}
