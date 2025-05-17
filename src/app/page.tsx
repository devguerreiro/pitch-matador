"use client";

import { useEffect, useRef, useState } from "react";

import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

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

  function playRecording() {
    if (recordedChunks.current.length > 0) {
      const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
      const audioURL = URL.createObjectURL(blob);
      const audio = new Audio(audioURL);
      audio.play();

      audio.onended = () => URL.revokeObjectURL(audioURL);
    }
  }

  function startRecording() {
    if (!audioStream) {
      console.error("No audio stream available.");
      return;
    }

    recordedChunks.current = [];

    mediaRecorder.current = new MediaRecorder(audioStream);

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current = [...recordedChunks.current, event.data];
        playRecording();
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
        <Button
          className="h-24 w-24 rounded-full bg-transparent border-2 border-primary text-primary text-lg font-semibold uppercase hover:bg-primary/80 hover:text-white hover:cursor-pointer hover:scale-110 duration-300"
          onClick={startRecording}
          disabled={isRecording}
        >
          Ouvir
        </Button>
      )}
    </div>
  );
}
