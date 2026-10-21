"use client";

import { useState } from "react";
import { LessonFocus } from "./lesson-focus";
import { LessonReader, type LessonReaderModel } from "./lesson-reader";

/**
 * Lesson view switch. Focus (card deck) is the DEFAULT, the full article
 * remains one tap away, never deleted. Nobody is forced past a wall of text.
 */
export function LessonView({
  model,
  quizHref,
}: {
  model: LessonReaderModel;
  quizHref: string;
}) {
  const [mode, setMode] = useState<"focus" | "article">("focus");

  return mode === "focus" ? (
    <LessonFocus model={model} quitToFullView={() => setMode("article")} quizHref={quizHref} />
  ) : (
    <div>
      <div className="mb-4 flex justify-center">
        <button
          type="button"
          onClick={() => setMode("focus")}
          className="min-h-9 rounded-full bg-white px-3 text-sm font-medium text-forest ring-1 ring-forest-100 hover:ring-forest-500"
        >
          ← Back to point-by-point cards
        </button>
      </div>
      <LessonReader model={model} />
    </div>
  );
}
