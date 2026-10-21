"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Accessible modal dialog on native <dialog>. Focus is trapped by the
 * platform, Escape closes, and focus returns to the trigger.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "mx-auto max-w-lg rounded-card bg-white p-0 ring-1 ring-forest-100 backdrop:bg-forest-900/40",
        className,
      )}
      aria-labelledby="modal-title"
    >
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-semibold text-forest">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="min-h-9 min-w-9 rounded-md px-2 text-lg text-mist hover:bg-forest-100"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
