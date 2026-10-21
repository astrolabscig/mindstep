import Link from "next/link";

const groups = [
  {
    heading: "Explore",
    links: [
      { href: "/topics", label: "Topics" },
      { href: "/scenarios", label: "Practice conversations" },
      { href: "/planner", label: "Action planner" },
    ],
  },
  {
    heading: "Support",
    links: [
      { href: "/support", label: "Find support" },
      { href: "/safety", label: "Safety and crisis info" },
      { href: "/research", label: "Research and references" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/admin", label: "Admin" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-forest-100 bg-forest text-canvas">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-lg font-semibold tracking-tight text-white">
            MIND<span className="text-sage">STEP</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-canvas/70">
            Understand your mind. Practise the words. Know your next step.
          </p>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-canvas/60">
            MINDSTEP is educational. It cannot diagnose, treat, or monitor anyone. In an emergency
            call <strong className="text-sage">112</strong>.
          </p>
        </div>
        {groups.map((g) => (
          <nav key={g.heading} aria-label={g.heading}>
            <p className="text-xs font-semibold uppercase tracking-wider text-sage/80">{g.heading}</p>
            <ul className="mt-3 space-y-2">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-canvas/80 hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-forest-700">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-canvas/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 MINDSTEP. AXELLEMD programming internship assignment.</p>
        </div>
      </div>
    </footer>
  );
}
