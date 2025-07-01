// For App Router: src/app/api/tts/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input,
    });

    const arrayBuffer = await mp3.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return new NextResponse("Error generating TTS", { status: 500 });
  }
}
