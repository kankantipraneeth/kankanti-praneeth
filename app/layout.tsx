import type { Metadata, Viewport } from "next";
import { profile } from "@/content/site";
import { anek, anekTelugu, martian } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${profile.name}: Full-stack + AI developer`, template: `%s · ${profile.name}` },
  description: "Full-stack developer in Hyderabad who builds production websites and AI automations. Case studies, resume and contact.",
  openGraph: { type: "website", siteName: profile.name, locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0D0C0A", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anek.variable} ${anekTelugu.variable} ${martian.variable}`} suppressHydrationWarning>
      <body className="min-h-svh bg-ink font-sans text-paper antialiased">
        <a href="#main" className="skip-link label">
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
