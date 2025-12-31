'use client';

import {useLanguage, useTranslation} from "@/app/i18n/client";
import {useEffect, useState} from "react";
import {FML, init} from "@/app/wasm/wasm-loader";

function Title({ t, onStart }: { t: (key: string) => string, onStart: () => void }) {
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
            <div className="flex gap-8">
                <button
                    className="px-8 py-3 rounded-lg bg-green-900/80 border-2 border-green-400 text-green-100 font-mono text-lg shadow-md hover:bg-green-700/80 hover:scale-105 transition-all duration-200"
                    onClick={onStart}
                >
                    {t('title.start')}
                </button>
                <button
                    className="px-8 py-3 rounded-lg bg-gray-800/80 border-2 border-gray-400 text-gray-200 font-mono text-lg shadow-md hover:bg-gray-700/80 hover:scale-105 transition-all duration-200"
                >
                    {t('title.settings')}
                </button>
            </div>
        </div>
    );
}

function Game({ t, wasm }: { t: (key: string) => string, wasm: FML }) {
    const [hex, setHex] = useState<[string, string] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(3);
    const [displayIndex, setDisplayIndex] = useState(0);
    const [input, setInput] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [isBlank, setIsBlank] = useState(false);
    const [showSpeed, setShowSpeed] = useState(200);

    // hex[1]を2文字ずつ分割した配列
    const noSpaceHexArr = hex ? (hex[1].match(/.{1,2}/g) || []) : [];

    useEffect(() => {
        try {
            const result = wasm.GenHex(4);
            if (result.error) setError(result.error);
            else if (result.value) setHex(result.value);
            else setError("GenHexの戻り値が不正です");
        } catch (e) {
            setError((e as Error)?.message ?? "WASM呼び出しに失敗しました");
        }
    }, [wasm]);

    useEffect(() => {
        if (hex && countdown !== null && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (hex && countdown === 0) {
            setTimeout(() => setCountdown(null), 1000);
        }
    }, [hex, countdown]);

    // 点滅処理
    useEffect(() => {
        if (hex && countdown === null && displayIndex < noSpaceHexArr.length) {
            const timer = setTimeout(() => {
                if (isBlank) {
                    setDisplayIndex(displayIndex + 1);
                }
                setIsBlank(!isBlank);
            }, showSpeed);
            return () => clearTimeout(timer);
        }
    }, [hex, countdown, displayIndex, isBlank, noSpaceHexArr.length, showSpeed]);

    // フラッシュ表示後に一度だけconsole.log
    useEffect(() => {
        if (hex && displayIndex === noSpaceHexArr.length) {
            const runResult = wasm.RunCode(hex[1]);
            console.log("RunCode result:", runResult.value);
        }
    }, [hex, displayIndex, wasm, noSpaceHexArr.length]);

    if (error) return <div>エラー: {error}</div>;
    if (!hex) return <div>Loading...</div>;
    if (countdown !== null) return <div style={{ fontSize: 48 }}>{countdown > 0 ? countdown : "スタート!"}</div>;

    // フラッシュ表示中
    if (displayIndex < noSpaceHexArr.length) {
        return (
            <div className="flex flex-col items-center">
                <div className="text-white text-5xl font-mono" style={{ letterSpacing: "0.2em" }}>
                    {isBlank ? "" : noSpaceHexArr[displayIndex]}
                </div>
            </div>
        );
    }

    // フラッシュ表示後にテキストフィールドを表示
    return (
        <div className="flex flex-col items-center">
            <form
                onSubmit={e => {
                    e.preventDefault();
                    setSubmitted(true);
                    const runResult = wasm.RunCode(hex[1]);
                    if (runResult.error) {
                        setResult("エラー: " + runResult.error);
                    } else if (runResult.value === input) {
                        setResult("正解！");
                    } else {
                        setResult("不正解");
                    }
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="text-black text-2xl px-4 py-2 rounded"
                    autoFocus
                    disabled={submitted}
                />
                <button
                    type="submit"
                    className="ml-4 px-4 py-2 bg-green-700 text-white rounded"
                    disabled={submitted}
                >
                    {t('game.submit')}
                </button>
            </form>
            {submitted && (
                <div className="mt-4 text-green-300">
                    入力値: {input}<br />
                    {result}
                </div>
            )}
        </div>
    );
}

export default function ClientComponent() {
    const {language} = useLanguage();
    const {t} = useTranslation(language);

    const [showTitle, setShowTitle] = useState(true);
    const [game, setGame] = useState(false);

    const handleStart = () => {
        setShowTitle(false);
        setGame(true);
    };

    const [wasm, setWasm] = useState<FML | null>(null);
    const [wasmError, setWasmError] = useState<string | null>(null);

    useEffect(() => {
        init()
            .then(setWasm)
            .catch(e => setWasmError(e?.message ?? "WASMの初期化に失敗しました"));
    }, []);

    if (wasmError) return <div>エラー: {wasmError}</div>;


    return (
        <div className="min-h-screen min-w-screen flex">
            <main className="flex-1 flex items-center justify-center bg-black">
                {showTitle && <Title t={t} onStart={handleStart} />}
                {game && wasm && <Game t={t} wasm={wasm} />}
            </main>
        </div>
    );
}