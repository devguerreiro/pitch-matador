import speech from "@google-cloud/speech";

import { NextRequest } from "next/server";

const credentials = {
  type: process.env.GOOGLE_CLOUD_TYPE,
  project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
  private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
  client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
  auth_uri: process.env.GOOGLE_CLOUD_AUTH_URI,
  token_uri: process.env.GOOGLE_CLOUD_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
  universe_domain: process.env.GOOGLE_CLOUD_UNIVERSE_DOMAIN,
};
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
