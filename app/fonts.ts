import { Anek_Latin, Martian_Mono } from "next/font/google";
import localFont from "next/font/local";

export const anek = Anek_Latin({ subsets: ["latin"], axes: ["wdth"], variable: "--font-anek", display: "swap" });
// The site uses one Telugu cluster (ప్ర), so ship a 9 KB subset instead of the 393 KB full font.
// Variable wght + wdth axes and GSUB shaping are kept. Source and licence: app/fonts/README.md.
export const anekTelugu = localFont({ src: "./fonts/anek-telugu-pra.woff2", weight: "100 800", variable: "--font-anek-telugu", display: "swap" });
// Labels and readouts only, never the LCP element: no preload, so it doesn't compete with the display font.
export const martian = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-martian", display: "swap", preload: false });
