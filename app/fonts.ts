import { Anek_Latin, Anek_Telugu, Martian_Mono } from "next/font/google";

export const anek = Anek_Latin({ subsets: ["latin"], axes: ["wdth"], variable: "--font-anek", display: "swap" });
export const anekTelugu = Anek_Telugu({ subsets: ["telugu"], axes: ["wdth"], variable: "--font-anek-telugu", display: "swap" });
export const martian = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-martian", display: "swap" });
