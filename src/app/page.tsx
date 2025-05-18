"use client";

import { useEffect, useRef, useState } from "react";

import { LoaderCircle } from "lucide-react";

import { toast } from "sonner";

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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isDiscouraging, setIsDiscouraging] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const [discourage, setDiscourage] = useState<string>("");

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

  async function transcribeAudio(audio: Blob) {
    setIsTranscribing(true);

    try {
      const arrayBuffer = await audio.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString("base64");

      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: JSON.stringify({ audioData: base64Audio }),
      });

      if (response.ok) {
        return (await response.json()) as TranscriptionResponse;
      } else {
        toast.error("Transcrição", {
          description: "Erro ao transcrever áudio",
        });
      }
      // eslint-disable-next-line
    } catch (err: unknown) {
      toast.error("Transcrição", {
        description: "Erro ao comunicar com a API",
      });
    } finally {
      setIsTranscribing(false);
    }
  }

  async function discourageTranscription(transcription: string) {
    setIsDiscouraging(true);

    try {
      const prompt = `
      Analise a brilhante ideia de startup: "${transcription}". Retorne uma avaliação no seguinte formato, utilizando uma nota de 1 (péssima) a 5 (levemente menos pior) e uma frase sarcástica que capture a essência da sua 'genialidade':

      Ideia:
      Nota:
      Frase Sarcástica:
      `;

      const response = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        return (await response.json()) as GeminiResponse;
      } else {
        toast.error("Desmotivação", {
          description: "Erro ao enviar prompt",
        });
      }
      // eslint-disable-next-line
    } catch (err: unknown) {
      toast.error("Desmotivação", {
        description: "Erro ao comunicar com a API",
      });
    } finally {
      setIsDiscouraging(false);
    }
  }

  function startRecording() {
    if (!audioStream) {
      console.error("No audio stream available.");
      return;
    }

    recordedChunks.current = [];

    mediaRecorder.current = new MediaRecorder(audioStream);

    mediaRecorder.current.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        const transcribedAudio = await transcribeAudio(event.data);
        if (transcribedAudio && transcribedAudio.transcription) {
          const discourage = await discourageTranscription(
            transcribedAudio.transcription
          );
          if (discourage && discourage.response) {
            setDiscourage(discourage.response);
          } else {
            toast.info("Não compreendi, fale novamente por favor");
          }
        } else {
          toast.info("Não compreendi, fale novamente por favor");
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
    }, 5000);
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
          <span>Ouvindo essa ideia de merda...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center text-center">
          {isTranscribing ? (
            <span>Tentando entender essa porcaria</span>
          ) : isDiscouraging ? (
            <span>Verificando se vale a pena essa imbecilidade</span>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Button
                className="p-8 rounded-full bg-transparent border-2 border-primary text-primary text-lg font-semibold uppercase hover:bg-primary/80 hover:text-white hover:cursor-pointer hover:scale-110 duration-300"
                onClick={startRecording}
                disabled={isRecording}
              >
                {discourage
                  ? "Ouvir outra ideia de merda"
                  : "Ouvir ideia de merda"}
              </Button>
              {discourage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
