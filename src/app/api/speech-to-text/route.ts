import speech from "@google-cloud/speech";

import { NextRequest } from "next/server";

const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS_JSON);
const client = new speech.SpeechClient({ credentials });

export async function POST(req: NextRequest) {
  const { audioData } = await req.json();

  const request = {
    audio: {
      content: Buffer.from(audioData, "base64").toString("base64"),
    },
    config: {
      encoding: "WEBM_OPUS" as const,
      languageCode: "pt-BR",
    },
  };

  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();
  const transcription = response.results
    ?.map((result) => result.alternatives?.[0]?.transcript)
    .filter((transcript) => transcript)
    .join("\n");

  return Response.json({ transcription });
}
