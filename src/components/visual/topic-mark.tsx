import type { ThemeId } from "@/content/cards";
import { cn } from "@/lib/utils";

/**
 * Small line-art marks for the seven topics. They replace the tiny unDraw
 * thumbnails, which read as dark blobs at card size. Decorative only: the
 * heading beside every mark carries the meaning.
 */

const SIZES = {
  sm: "h-9 w-9 rounded-xl",
  md: "h-12 w-12 rounded-2xl",
  lg: "h-16 w-16 rounded-[1.25rem]",
} as const;

function Mark({ theme }: { theme: ThemeId }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (theme) {
    case "feeling-overwhelmed":
      return (
        <g {...common}>
          <path d="M5 7.5h14M5 12h14M5 16.5h8" />
          <circle cx="17.5" cy="16.5" r="2.5" />
        </g>
      );
    case "low-mood":
      return (
        <g {...common}>
          <path d="M12 20V9" />
          <path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5Z" />
          <path d="M12 16c-2 0-4-1.2-4-3.5 2.5 0 4 1.3 4 3.5Z" />
          <path d="M7 20h10" />
        </g>
      );
    case "worry":
      return (
        <g {...common}>
          <path d="M5 12c0-3.6 3.1-6 7-6s7 2.4 7 6-3.1 6-7 6-7-2.4-7-6Z" />
          <path d="M9 12c.8-1.4 2.2-2 3.5-1.2 1.1.7 1.1 2.4-.3 2.7-1.3.3-2.2-1-1.4-2.1" />
        </g>
      );
    case "sleep":
      return (
        <g {...common}>
          <path d="M18.5 14.5A6.5 6.5 0 0 1 9.5 5.5a6.5 6.5 0 1 0 9 9Z" />
          <path d="M16.5 5.5h3l-3 3.5h3" />
        </g>
      );
    case "talking-helping":
      return (
        <g {...common}>
          <path d="M4.5 6.5h10v7h-5l-3 2.5v-2.5h-2v-7Z" />
          <path d="M13.5 10h6v5.5h-2v2l-2.5-2h-1.5V10Z" />
        </g>
      );
    case "myths":
      return (
        <g {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M9.6 9.5a2.6 2.6 0 0 1 5.1.7c0 1.8-2.7 2-2.7 3.8" />
          <path d="M12 17.2h.01" />
        </g>
      );
    case "getting-help":
      return (
        <g {...common}>
          <path d="M6 20V9.5L12 5l6 4.5V20" />
          <path d="M9.5 20v-5h5v5" />
          <path d="M12 8.5v.01" />
        </g>
      );
  }
}

export function TopicMark({
  theme,
  size = "md",
  className,
}: {
  theme: ThemeId;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-mint-100 text-teal-600 ring-1 ring-mint-200",
        SIZES[size],
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]">
        <Mark theme={theme} />
      </svg>
    </span>
  );
}
