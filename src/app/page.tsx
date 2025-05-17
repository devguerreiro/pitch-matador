"use client";

import { useEffect, useState } from "react";

import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  const [isCapturingAudio, setIsCapturingAudio] = useState(false);

  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

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

    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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

  function captureAudio() {
    if (!isCapturingAudio) {
      setIsCapturingAudio(true);
      setTimeout(() => {
        setIsCapturingAudio(false);
      }, 3000);
    }
  }

  return (
    <div className="container h-screen flex justify-center items-center">
      {isCapturingAudio ? (
        <div className="flex flex-col items-center gap-1">
          <LoaderCircle className="animate-spin" />
          <span>Analisando ambiente</span>
        </div>
      ) : (
        <Button
          className="h-24 w-24 rounded-full bg-transparent border-2 border-primary text-primary text-lg font-semibold uppercase hover:bg-primary/80 hover:text-white hover:cursor-pointer hover:scale-110 duration-300"
          onClick={captureAudio}
          disabled={isCapturingAudio}
        >
          Ouvir
        </Button>
      )}
    </div>
  );
}
