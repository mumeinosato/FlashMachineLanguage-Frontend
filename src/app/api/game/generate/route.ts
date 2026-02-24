import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { getServerWasm } from '../_wasm';

const SECRET = process.env.GAME_SECRET ?? 'flash-machine-language-secret';

export async function POST(req: NextRequest) {
    const { level } = await req.json();

    console.log('Received level:', level);

    let wasm;
    try {
        wasm = await getServerWasm();
    } catch (e) {
        return NextResponse.json({ error: 'WASM initialization failed: ' + (e as Error).message }, { status: 500 });
    }

    const hexResult = wasm.GenHex(Number(level));
    if (hexResult.error) {
        return NextResponse.json({ error: hexResult.error }, { status: 500 });
    }

    const hexBytes = hexResult.value![1];

    const debugAnswer = wasm.RunCode(hexBytes);
    console.log(`[DEBUG] hex: ${hexBytes} / answer: ${debugAnswer.value ?? debugAnswer.error}`);

    const token = createHmac('sha256', SECRET).update(hexBytes).digest('hex');

    return NextResponse.json({ hexBytes, token });
}
