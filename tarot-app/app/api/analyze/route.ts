import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { question, cardName, cardMeaning, cardArchetype } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Fallback for when no API key is set
      return NextResponse.json({ 
        interpretation: `[Demo Mode] I see you drew ${cardName}. Without my AI spirit (API Key), I can only tell you this: ${cardMeaning}. (Please add GEMINI_API_KEY to your .env file to unlock my full potential!)`
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are a wise Jungian Tarot Reader. You do not predict the future. 
      Instead, you use Tarot cards as mirrors for the subconscious mind, helping the querent understand their inner archetypes.

      Context:
      - The User's Question: "${question}"
      - The Drawn Card: "${cardName}"
      - Traditional Meaning: "${cardMeaning}"
      - Archetype: "${cardArchetype}"

      Task:
      Provide a brief, profound psychological interpretation (approx. 3-4 sentences). 
      1. Acknowledge the question with empathy.
      2. Connect the card's archetype to the user's situation.
      3. End with a reflective question that encourages self-discovery.
      
      Tone: Mystical but grounded, compassionate, insightful. Avoid fortune-telling clichés like "you will meet someone".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const interpretation = response.text();

    return NextResponse.json({ interpretation });

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "Failed to consult the spirits." },
      { status: 500 }
    );
  }
}
