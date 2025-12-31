import { dir } from 'i18next';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FlashMachineLanguage"
};

export default async function RootLayout({children, params: paramsPromise,}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
    const params = await paramsPromise;
    const lang = params.lang;
    return (
        <html lang={lang} dir={dir(lang)} className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script src="/wasm/wasm_exec.js"></script>
        </head>
        <body>{children}</body>
        </html>
    );
}
