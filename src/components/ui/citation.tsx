"use client";

import { useState } from "react";
import { referenceMap } from "@/content/references";
import type { Reference } from "@/content/schema";
import { cn } from "@/lib/utils";

export function Citation({ id, className }: { id: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref: Reference | undefined = referenceMap[id];
  if (!ref) return null;
  return (
    <span className={cn("relative inline", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline cursor-pointer rounded align-super text-xs font-semibold text-quietblue-600 hover:text-forest-700"
      >
        [{ref.id}]
      </button>
      {open ? (
        <span
          role="status"
          className="absolute left-0 top-6 z-20 block w-72 rounded-lg bg-white p-3 text-left text-xs leading-relaxed text-ink shadow-lg ring-1 ring-forest-100"
        >
          <strong className="text-forest">{ref.institution}</strong> ({ref.year}). {ref.title}.{" "}
          <a href={ref.url} target="_blank" rel="noreferrer" className="underline">
            Source
          </a>{" "}
          <span className="text-mist">(checked {ref.accessDate})</span>
          <button type="button" onClick={() => setOpen(false)} className="mt-1 block underline text-mist">
            Close
          </button>
        </span>
      ) : null}
    </span>
  );
}
