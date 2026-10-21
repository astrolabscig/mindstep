import { cn } from "@/lib/utils";

type Tone = "neutral" | "positive" | "warning" | "info" | "inverse";

const tones: Record<Tone, string> = {
  neutral: "bg-forest-100 text-forest-700",
  positive: "bg-[#e9f6ee] text-[#1e7a46]",
  warning: "bg-[#faf3dc] text-[#7d621a]",
  info: "bg-quietblue text-quietblue-600",
  inverse: "bg-forest text-sage",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
