'use client';

import {useLanguage, useTranslation} from "@/app/i18n/client";
import {useEffect, useState} from "react";
import {useRouter, usePathname} from "next/navigation";
import {availableLanguages} from "@/app/i18n/settings";

function LanguageSwitcher({ currentLang, onSwitch }: { currentLang: string, onSwitch: (lang: string) => void }) {
    return (
        <div className="fixed top-4 right-4 flex gap-1 z-50">
            {availableLanguages.map((lang) => (
                <button
                    key={lang}
                    onClick={() => onSwitch(lang)}
                    className={`w-12 py-1 rounded font-mono text-sm border text-center transition-all duration-200 ${
                        currentLang === lang
                            ? "bg-green-700/90 border-green-400 text-green-100 shadow-[0_0_8px_#3fa96b]"
                            : "bg-black/60 border-green-800 text-green-500 hover:bg-green-900/60 hover:border-green-500 hover:text-green-200"
                    }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

function HowToPlayModal({ t, onClose }: { t: (key: string) => string, onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <div
                className="bg-black border border-green-700 rounded-xl p-8 flex flex-col gap-6 shadow-[0_0_32px_#1e5631] max-w-lg w-full mx-4"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="font-mono text-green-300 text-xl tracking-widest text-center" style={{ textShadow: '0 0 8px #3fa96b' }}>
                    {t('how_to_play.title')}
                </h2>
                <div className="flex flex-col gap-4">
                    {[
                        { title: t('how_to_play.step1_title'), body: t('how_to_play.step1_body'), num: '01' },
                        { title: t('how_to_play.step2_title'), body: t('how_to_play.step2_body'), num: '02' },
                        { title: t('how_to_play.step3_title'), body: t('how_to_play.step3_body'), num: '03' },
                    ].map(({ title, body, num }) => (
                        <div key={num} className="flex gap-3 items-start">
                            <span className="font-mono text-green-600 text-sm mt-0.5 shrink-0">[{num}]</span>
                            <div>
                                <div className="font-mono text-green-300 text-sm font-bold mb-0.5">{title}</div>
                                <div className="font-mono text-green-700 text-xs leading-relaxed">{body}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-green-900 pt-4">
                    <div className="font-mono text-green-500 text-xs font-bold mb-1">{t('how_to_play.feedback_title')}</div>
                    <div className="font-mono text-green-800 text-xs leading-relaxed">{t('how_to_play.feedback_body')}</div>
                    <a
                        href="https://github.com/mumeinosato/FlashMachineLanguage-Frontend/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block font-mono text-xs text-green-600 hover:text-green-400 underline transition-colors duration-200"
                    >
                        GitHub Issues →
                    </a>
                </div>
                <button
                    onClick={onClose}
                    className="font-mono text-xs text-green-800 hover:text-green-500 transition-colors duration-200 tracking-widest text-center"
                >
                    [ CLOSE ]
                </button>
            </div>
        </div>
    );
}

function SettingsModal({ level, onSelect, onClose }: { level: number, onSelect: (l: number) => void, onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <div
                className="bg-black border border-green-700 rounded-xl p-8 flex flex-col items-center gap-6 shadow-[0_0_32px_#1e5631]"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="font-mono text-green-300 text-xl tracking-widest" style={{ textShadow: '0 0 8px #3fa96b' }}>
                    LEVEL
                </h2>
                <div className="flex gap-4">
                    {[1, 2, 3, 4].map(l => (
                        <button
                            key={l}
                            onClick={() => { onSelect(l); onClose(); }}
                            className={`w-14 py-3 rounded-lg font-mono text-lg border-2 transition-all duration-200 ${
                                level === l
                                    ? 'bg-green-700/90 border-green-400 text-green-100 shadow-[0_0_10px_#3fa96b]'
                                    : 'bg-black/60 border-green-800 text-green-500 hover:bg-green-900/60 hover:border-green-500 hover:text-green-200'
                            }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="font-mono text-xs text-green-800 hover:text-green-500 transition-colors duration-200 tracking-widest"
                >
                    [ CLOSE ]
                </button>
            </div>
        </div>
    );
}

function Title({ t, onStart, onSettings, onHowToPlay }: { t: (key: string) => string, onStart: () => void, onSettings: () => void, onHowToPlay: () => void }) {
    return (
        <div className="flex flex-col items-center">
            <h1
                className="text-5xl md:text-7xl font-mono font-bold text-green-200 mb-10 select-none"
                style={{
                    textShadow: '0 0 12px #3fa96b, 0 0 24px #1e5631',
                    letterSpacing: '0.15em'
                }}
            >
                {t('title.title')}
            </h1>
            <div className="flex gap-4">
                <button
                    className="px-8 py-3 rounded-lg bg-green-900/80 border-2 border-green-400 text-green-100 font-mono text-lg shadow-md hover:bg-green-700/80 hover:scale-105 transition-all duration-200"
                    onClick={onStart}
                >
                    {t('title.start')}
                </button>
                <button
                    className="px-8 py-3 rounded-lg bg-gray-800/80 border-2 border-gray-400 text-gray-200 font-mono text-lg shadow-md hover:bg-gray-700/80 hover:scale-105 transition-all duration-200"
                    onClick={onSettings}
                >
                    {t('title.settings')}
                </button>
                <button
                    className="px-8 py-3 rounded-lg bg-gray-900/80 border-2 border-green-800 text-green-400 font-mono text-lg shadow-md hover:bg-green-900/60 hover:border-green-500 hover:text-green-200 hover:scale-105 transition-all duration-200"
                    onClick={onHowToPlay}
                >
                    {t('title.how_to_play')}
                </button>
            </div>
        </div>
    );
}

function Game({ t, level, onReplay, onSettings }: { t: (key: string) => string, level: number, onReplay: () => void, onSettings: () => void }) {
    const [hexBytes, setHexBytes] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(3);
    const [displayIndex, setDisplayIndex] = useState(0);
    const [input, setInput] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<'correct' | 'incorrect' | 'error' | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
    const [isBlank, setIsBlank] = useState(false);
    const showSpeed = Math.round(200 + (4 - level) * 200 / 3);

    const noSpaceHexArr = hexBytes ? (hexBytes.match(/.{1,2}/g) || []) : [];

    useEffect(() => {
        fetch('/api/game/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level }),
        })
            .then(r => r.json())
            .then(data => {
                if (data.error) setError(data.error);
                else {
                    setHexBytes(data.hexBytes);
                    setToken(data.token);
                }
            })
            .catch(e => setError(e.message ?? 'Generate failed'));
    }, [level]);

    useEffect(() => {
        if (hexBytes && countdown !== null && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (hexBytes && countdown === 0) {
            setTimeout(() => setCountdown(null), 1000);
        }
    }, [hexBytes, countdown]);

    useEffect(() => {
        if (hexBytes && countdown === null && displayIndex < noSpaceHexArr.length) {
            const timer = setTimeout(() => {
                if (isBlank) setDisplayIndex(displayIndex + 1);
                setIsBlank(!isBlank);
            }, showSpeed);
            return () => clearTimeout(timer);
        }
    }, [hexBytes, countdown, displayIndex, isBlank, noSpaceHexArr.length, showSpeed]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hexBytes || !token) return;
        setSubmitted(true);
        try {
            const r = await fetch('/api/game/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hexBytes, token, userAnswer: input }),
            });
            const data = await r.json();
            if (data.error) {
                setResult('error');
            } else if (data.correct) {
                setResult('correct');
            } else {
                setResult('incorrect');
                setCorrectAnswer(data.correctAnswer);
            }
        } catch (e) {
            setResult('error');
        }
    };

    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!hexBytes) return <div className="text-white">Loading...</div>;
    if (countdown !== null) return <div className="text-white" style={{ fontSize: 48 }}>{countdown > 0 ? countdown : "スタート!"}</div>;

    if (displayIndex < noSpaceHexArr.length) {
        return (
            <div className="flex flex-col items-center">
                <div className="text-white text-5xl font-mono" style={{ letterSpacing: "0.2em" }}>
                    {isBlank ? "" : noSpaceHexArr[displayIndex]}
                </div>
            </div>
        );
    }

    const isCorrect = result === 'correct';
    return (
        <div className="flex flex-col items-center gap-6">
            {!submitted && (
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="bg-black border-2 border-white text-white font-mono text-2xl px-4 py-2 rounded-lg w-48 text-center outline-none focus:border-green-400 transition-colors duration-200"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="px-8 py-3 rounded-lg bg-green-900/80 border-2 border-green-400 text-green-100 font-mono text-lg shadow-md hover:bg-green-700/80 hover:scale-105 transition-all duration-200"
                    >
                        {t('game.submit')}
                    </button>
                </form>
            )}
            {submitted && result && (
                <div className="flex flex-col items-center gap-4">
                    <div
                        className={`font-mono text-4xl font-bold tracking-widest ${
                            isCorrect ? 'text-green-300' : 'text-red-400'
                        }`}
                        style={{
                            textShadow: isCorrect
                                ? '0 0 16px #3fa96b, 0 0 32px #1e5631'
                                : '0 0 16px #dc2626, 0 0 32px #7f1d1d'
                        }}
                    >
                        {isCorrect ? t('game.correct') : t('game.incorrect')}
                    </div>
                    {!isCorrect && correctAnswer && (
                        <div className="font-mono text-sm text-green-700">
                            {t('game.correct_answer')}: <span className="text-green-400">{correctAnswer}</span>
                        </div>
                    )}
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={onReplay}
                            className="px-8 py-3 rounded-lg bg-green-900/80 border-2 border-green-400 text-green-100 font-mono text-lg shadow-md hover:bg-green-700/80 hover:scale-105 transition-all duration-200"
                        >
                            {t('game.replay')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ClientComponent() {
    const {language, setLanguage} = useLanguage();
    const {t} = useTranslation(language);
    const router = useRouter();
    const pathname = usePathname();

    const handleLangSwitch = (lang: string) => {
        setLanguage(lang);
        const newPath = pathname.replace(/^\/[^/]+/, `/${lang}`);
        router.push(newPath);
    };

    const [showTitle, setShowTitle] = useState(true);
    const [game, setGame] = useState(false);
    const [gameKey, setGameKey] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [level, setLevel] = useState(1);

    const handleStart = () => {
        setShowTitle(false);
        setGame(true);
    };

    const handleReplay = () => {
        setGameKey(k => k + 1);
    };

    return (
        <div className="min-h-screen min-w-screen flex">
            {showTitle && <LanguageSwitcher currentLang={language} onSwitch={handleLangSwitch} />}
            <main className="flex-1 flex items-center justify-center bg-black">
                {showTitle && <Title t={t} onStart={handleStart} onSettings={() => setShowSettings(true)} onHowToPlay={() => setShowHowToPlay(true)} />}
                {game && <Game key={`${gameKey}-${level}`} t={t} level={level} onReplay={handleReplay} onSettings={() => setShowSettings(true)} />}
                {showSettings && <SettingsModal level={level} onSelect={(l) => { setLevel(l); setGameKey(k => k + 1); }} onClose={() => setShowSettings(false)} />}
                {showHowToPlay && <HowToPlayModal t={t} onClose={() => setShowHowToPlay(false)} />}
            </main>
            {showTitle && (
                <a
                    href="https://github.com/mumeinosato/FlashMachineLanguage-Frontend"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed top-4 left-4 flex items-center gap-2 px-3 py-1 rounded font-mono text-sm border border-green-800 bg-black/60 text-green-500 hover:border-green-500 hover:text-green-200 hover:bg-green-900/60 transition-all duration-200 z-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                </a>
            )}
        </div>
    );
}