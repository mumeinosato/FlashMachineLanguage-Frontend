import { LanguageProvider } from "@/app/i18n/client";
import ClientComponent from "@/app/[lang]/_components";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <main>
            <LanguageProvider initialLanguage={lang}>
                <ClientComponent />
            </LanguageProvider>
            <SpeedInsights />
        </main>
    );
}
