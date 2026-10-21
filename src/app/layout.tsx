import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MotionProvider } from "@/components/motion/motion-provider";

const bricolage = localFont({
  src: "../../public/fonts/bricolage-grotesque-latin.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MINDSTEP. Understand your mind. Practise the words. Know your next step.",
    template: "%s · MINDSTEP",
  },
  description:
    "A mental health literacy and support app for Ghana: learn the concepts, practise supportive responses in realistic conversations, and find services checked against official sources.",
  applicationName: "MINDSTEP",
  keywords: ["mental health", "Ghana", "mental health literacy", "support", "education"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E2928",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body className="antialiased flex min-h-screen flex-col">
        <MotionProvider>
          <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-forest-900 focus:shadow"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
