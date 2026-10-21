import { cn } from "@/lib/utils";

type Tone = "note" | "safety" | "positive" | "caution";

const tones: Record<Tone, string> = {
  note: "bg-quietblue/60 ring-quietblue-600/25 text-ink",
  safety: "bg-[#f9ede4] ring-[#a3532b]/30 text-ink",
  positive: "bg-[#e9f6ee] ring-[#1e7a46]/25 text-ink",
  caution: "bg-[#faf3dc] ring-[#7d621a]/25 text-ink",
};

const icons: Record<Tone, string> = {
  note: "i",
  safety: "!",
  positive: "✓",
  caution: "⚠",
};

export function Callout({
  tone = "note",
  title,
  className,
  children,
}: {
  tone?: Tone;
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className={cn("rounded-card px-4 py-3 ring-1", tones[tone], className)} data-tone={tone}>
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-full bg-white/80 text-sm font-bold"
        >
          {icons[tone]}
        </span>
        <div className="min-w-0">
          {title ? <p className="text-sm font-semibold text-forest">{title}</p> : null}
          <div className="text-sm leading-relaxed text-ink/85">{children}</div>
        </div>
      </div>
    </aside>
  );
}
