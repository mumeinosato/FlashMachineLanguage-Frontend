export interface GenHexResult {
    error?: string;
    value?: [string, string];
}

export interface RunCodeResult {
    error?: string;
    value?: string;
}

export interface FML {
    GenHex: (level: number) => GenHexResult;
    RunCode: (hex: string) => RunCodeResult;
}

declare function GenHex(level: number): GenHexResult;
declare function RunCode(hex: string): RunCodeResult;

export const init = async (): Promise<FML> => {
    const go = new Go();
    const result = await WebAssembly.instantiateStreaming(
        fetch("/wasm/main.wasm"),
        go.importObject
    );

    const instance = result.instance;
    go.run(instance);
    return { GenHex: GenHex, RunCode: RunCode };
}