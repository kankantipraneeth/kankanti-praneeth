import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Loader } from "@/components/loader/Loader";
import { LOADER_SCRIPT } from "@/components/loader/loader-script";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { profile } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";
import { anek, anekTelugu, martian } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  // Custom domain (NEXT_PUBLIC_SITE_URL), else Vercel's production domain, else localhost. See lib/site-url.ts.
  metadataBase: new URL(SITE_URL),
  title: { default: `${profile.name}: Full-stack + AI developer`, template: `%s · ${profile.name}` },
  description: "Full-stack developer in Hyderabad who builds production websites and AI automations. Case studies, resume and contact.",
  openGraph: { type: "website", siteName: profile.name, locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0D0C0A", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anek.variable} ${anekTelugu.variable} ${martian.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOADER_SCRIPT }} />
      </head>
      <body className="min-h-svh bg-ink font-sans text-paper antialiased">
        <SmoothScroll>
          <Loader />
          <a href="#main" className="skip-link label">
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
