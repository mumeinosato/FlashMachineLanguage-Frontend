import fs from 'fs';
import path from 'path';
import vm from 'vm';
import type { FML } from '@/app/wasm/wasm-loader';

let cachedWasm: FML | null = null;

export async function getServerWasm(): Promise<FML> {
    if (cachedWasm) return cachedWasm;

    const wasmExecPath = path.join(process.cwd(), 'public/wasm/wasm_exec.js');
    const wasmExecCode = fs.readFileSync(wasmExecPath, 'utf-8');
    vm.runInThisContext(wasmExecCode);

    const wasmPath = path.join(process.cwd(), 'public/wasm/main.wasm');
    const wasmBuffer = fs.readFileSync(wasmPath);

    const go = new (globalThis as any).Go();
    const result = await WebAssembly.instantiate(wasmBuffer, go.importObject);
    go.run(result.instance);

    cachedWasm = {
        GenHex: (globalThis as any).GenHex,
        RunCode: (globalThis as any).RunCode,
    } as FML;

    return cachedWasm;
}
