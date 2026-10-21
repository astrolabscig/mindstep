import { cn } from "@/lib/utils";

/**
 * MINDSTEP brand mark, three ascending steps with a "mind" spark.
 *
 * Steps = the product loop (understand → practise → next step), the spark =
 * the mind they serve. One-colour-safe geometry reads at 16px (favicon) and
 * scales to the header lockup. Inline SVG so it stays crisp and themable.
 */
export function LogoMark({
  className,
  title = "MINDSTEP",
  decorative = false,
}: {
  className?: string;
  title?: string;
  /** Use inside an already-labelled control (e.g. the home link). */
  decorative?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      className={cn("h-9 w-9 shrink-0", className)}
    >
      <rect width="40" height="40" rx="11" fill="#0E2928" />
      <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" fill="none" stroke="#FFFFFF" strokeOpacity="0.08" />
      <rect x="8.5" y="22.5" width="6" height="7.5" rx="2" fill="#B8F28B" fillOpacity="0.55" />
      <rect x="17" y="18" width="6" height="12" rx="2" fill="#B8F28B" fillOpacity="0.78" />
      <rect x="25.5" y="13" width="6" height="17" rx="2" fill="#B8F28B" />
      <circle cx="28.5" cy="8.2" r="2.2" fill="#D3EBE4" />
    </svg>
  );
}
