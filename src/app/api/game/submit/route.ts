import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { getServerWasm } from '../_wasm';

const SECRET = process.env.GAME_SECRET ?? 'flash-machine-language-secret';

export async function POST(req: NextRequest) {
    const { hexBytes, token, userAnswer } = await req.json();

    if (!hexBytes || !token || userAnswer === undefined) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const expectedToken = createHmac('sha256', SECRET).update(hexBytes).digest('hex');
    const expectedBuf = Buffer.from(expectedToken, 'hex');
    const receivedBuf = Buffer.from(token, 'hex');

    if (expectedBuf.length !== receivedBuf.length || !timingSafeEqual(expectedBuf, receivedBuf)) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    let wasm;
    try {
        wasm = await getServerWasm();
    } catch (e) {
        return NextResponse.json({ error: 'WASM initialization failed: ' + (e as Error).message }, { status: 500 });
    }

    const runResult = wasm.RunCode(hexBytes);
    console.log('RunCode result:', runResult);
    if (runResult.error) {
        return NextResponse.json({ error: runResult.error }, { status: 500 });
    }

    const correctAnswer = runResult.value!;
    const correct = correctAnswer === String(userAnswer);

    return NextResponse.json({ correct, correctAnswer });
}
