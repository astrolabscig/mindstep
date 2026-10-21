"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/**
 * Voice support for lesson cards.
 *
 * Primary path: bundled natural-voice MP3 (generated at build time by
 * scripts/generate-voice.ts using the offline Piper neural engine. See
 * docs/research.md §11). No cloud calls, no API keys, no paid service.
 *
 * Fallback path: the device's built-in speech synthesis (Web Speech API),
 * used when no bundled file exists. Both are on-device at runtime.
 */

const emptySubscribe = () => () => {};
function supportSnapshot() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
function supportServerSnapshot() {
  return false;
}

export function SpeakButton({
  text,
  src,
  className,
}: {
  text: string;
  /** Bundled natural-voice MP3, when one was pre-generated for this card. */
  src?: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsSupported = useSyncExternalStore(emptySubscribe, supportSnapshot, supportServerSnapshot);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (ttsSupported) window.speechSynthesis.cancel();
    };
  }, [ttsSupported]);

  if (!src && !ttsSupported) return null;

  function stopAll() {
    audioRef.current?.pause();
    audioRef.current = null;
    if (ttsSupported) window.speechSynthesis.cancel();
    setState("idle");
  }

  function speak() {
    if (state === "playing") {
      stopAll();
      return;
    }

    // Bundled natural voice first.
    if (src) {
      const audio = new Audio(src);
      audio.onended = () => setState("idle");
      audio.onerror = () => {
        if (ttsSupported) synthSpeak(text);
        else setState("idle");
      };
      audioRef.current = audio;
      audio.play().catch(() => setState("idle"));
      setState("playing");
      return;
    }
    synthSpeak(text);
  }

  function synthSpeak(spoken: string) {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(spoken.replace(/…/g, "..."));
    const voices = synth.getVoices();
    // Prefer the most natural installed voice: Windows "Online (Natural)"
    // voices first, then UK/African English, then any English voice.
    const voice =
      voices.find((v) => /online\s*\(natural\)/i.test(v.name)) ??
      voices.find((v) => /en[-_]gh/i.test(v.lang)) ??
      voices.find((v) => /en[-_]ng/i.test(v.lang)) ??
      voices.find((v) => /en[-_]gb/i.test(v.lang)) ??
      voices.find((v) => /^en/i.test(v.lang)) ??
      voices[0];
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");
    synth.cancel();
    synth.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-pressed={state === "playing"}
      aria-label={state === "playing" ? "Stop reading aloud" : "Listen to this point"}
      className={cn(
        "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-forest ring-1 ring-forest-100 transition hover:ring-forest-500",
        state === "playing" && "bg-sage/40 ring-forest-500",
        className,
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        {state === "playing" ? (
          <path d="M6 6h12v12H6z" strokeLinejoin="round" />
        ) : (
          <path d="M4 9v6h4l5 4V5L8 9H4zM16 8a5 5 0 010 8M18.5 6a8 8 0 010 12" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
      <span>{state === "playing" ? "Stop" : "Listen"}</span>
    </button>
  );
}
