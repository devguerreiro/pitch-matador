import { NextRequest } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-001" });

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return Response.json(
      { error: "O prompt é obrigatório e deve ser uma string." },
      { status: 400 }
    );
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (text) {
    return Response.json({ response: text });
  } else {
    return Response.json(
      { error: "Falha ao obter texto da resposta do Gemini." },
      { status: 500 }
    );
  }
}
