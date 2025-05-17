"use client";

import { useEffect, useRef, useState } from "react";

import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TranscriptionResponse {
  transcription?: string;
  error?: string;
}

interface GeminiResponse {
  response?: string;
  error?: string;
}

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const getMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setAudioStream(stream);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    };

    getMicrophone();
  }, []);

  function startRecording() {
    if (!audioStream) {
      console.error("No audio stream available.");
      return;
    }

    recordedChunks.current = [];

    mediaRecorder.current = new MediaRecorder(audioStream);

    mediaRecorder.current.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        recordedChunks.current = [...recordedChunks.current, event.data];
        const audioBlob = new Blob(recordedChunks.current, {
          type: "audio/webm;codecs=opus",
        });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString("base64");

        try {
          const response = await fetch("/api/speech-to-text", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ audioData: base64Audio }),
          });

          if (response.ok) {
            const data: TranscriptionResponse = await response.json();
            setTranscription(
              data.transcription || "Nenhuma transcrição recebida."
            );

            try {
              const res = await fetch("/api/gemini", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: data.transcription }),
              });

              if (res.ok) {
                const data: GeminiResponse = await res.json();
                setResponse(data.response || "");
              } else {
                const errorData: GeminiResponse = await res.json();
                setResponse(errorData.error || "Erro ao obter resposta.");
              }
            } catch (err) {
              console.error("Erro ao enviar prompt:", err);
              setResponse("Falha ao comunicar com o servidor.");
            }
          } else {
            console.error("Erro ao enviar áudio para transcrição");
            const errorData: TranscriptionResponse = await response.json();
            setTranscription(errorData.error || "Erro na transcrição.");
          }
        } catch (err) {
          console.error("Erro ao comunicar com a API:", err);
          setTranscription("Erro ao comunicar com o servidor.");
        }
      }
    };

    mediaRecorder.current.onstart = () => {
      setIsRecording(true);
    };

    mediaRecorder.current.onstop = () => {
      setIsRecording(false);
    };

    mediaRecorder.current.start();
    setTimeout(() => {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
      }
    }, 3000);
  }

  if (error) {
    return (
      <div className="container h-screen flex justify-center items-center">
        <span className=" text-center text-pretty">
          Ocorreu um erro ao solicitar o acesso ao seu microfone:{" "}
          <strong>{error}</strong>
        </span>
      </div>
    );
  }

  if (!audioStream) {
    return (
      <div className="container h-screen flex justify-center items-center">
        <span className=" text-center text-pretty">
          Obtendo acesso ao seu microfone...
        </span>
      </div>
    );
  }

  return (
    <div className="container h-screen flex justify-center items-center">
      {isRecording ? (
        <div className="flex flex-col items-center gap-1">
          <LoaderCircle className="animate-spin" />
          <span>Analisando ambiente</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center text-center">
          <Button
            className="h-24 w-24 rounded-full bg-transparent border-2 border-primary text-primary text-lg font-semibold uppercase hover:bg-primary/80 hover:text-white hover:cursor-pointer hover:scale-110 duration-300"
            onClick={startRecording}
            disabled={isRecording}
          >
            Ouvir
          </Button>
          <span>
            Transcrição: <strong>{transcription}</strong>
          </span>
          <span>
            Feedback: <strong>{response}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
