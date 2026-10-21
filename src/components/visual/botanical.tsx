import { cn } from "@/lib/utils";

/**
 * Soft botanical haze for section backgrounds. Inspired by the Cadabra.Studio
 * medical-app reference (pale mint wash + oversized leaf shapes), adapted to
 * MINDSTEP's palette. Purely decorative: aria-hidden, pointer-events-none,
 * no clinical meaning.
 */

const LEAF = "M50 0C88 34 102 82 50 130C-2 82 12 34 50 0Z";

function Leaf({
  x,
  y,
  rotate,
  scale,
  fill,
}: {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  fill: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d={LEAF} fill={fill} />
      <path d="M50 18V110" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

export function Botanical({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg
        viewBox="0 0 420 420"
        className="absolute -left-16 -top-24 h-[340px] w-[340px] sm:h-[430px] sm:w-[430px]"
      >
        <Leaf x={150} y={40} rotate={-30} scale={1.1} fill="#cfe8e2" />
        <Leaf x={214} y={16} rotate={-6} scale={0.85} fill="#d9efea" />
        <Leaf x={96} y={112} rotate={-62} scale={0.75} fill="#bfe0d9" />
        <Leaf x={252} y={112} rotate={22} scale={0.6} fill="#e3f2ef" />
      </svg>
      <svg
        viewBox="0 0 420 420"
        className="absolute -bottom-28 -right-20 h-[360px] w-[360px] sm:h-[450px] sm:w-[450px]"
      >
        <Leaf x={180} y={60} rotate={150} scale={1.05} fill="#d9efea" />
        <Leaf x={252} y={36} rotate={172} scale={0.8} fill="#cfe8e2" />
        <Leaf x={140} y={142} rotate={120} scale={0.7} fill="#bfe0d9" />
      </svg>
    </div>
  );
}
