"use client";

import { useState, useRef, useEffect } from "react";
import { speak } from "../actions";
import { EMOTION_GROUPS } from "../constants";

export interface AudioState {
  isPlaying: boolean;
  audioBlob: Blob | null;
  audioText: string;
}

export function useAudio() {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    audioBlob: null,
    audioText: "",
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element once the component loads
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const generateSpeech = async (
    formData: FormData,
    model: string,
    language: string
  ) => {
    setState((prev) => ({ ...prev, isPlaying: true }));

    try {
      const text = formData.get("text") as string;
      
      // Add model and language to formData
      formData.append("model", model);
      formData.append("language", language);
      
      // Process emotion selections
      const selectedEmotions: string[] = [];
      for (const group of EMOTION_GROUPS) {
        const fieldName = `emotion${group.id.charAt(0).toUpperCase() + group.id.slice(1)}`;
        const value = formData.get(fieldName) as string;
        if (value) {
          selectedEmotions.push(value);
        }
      }
      
      // If no emotions selected, use default (Positivity: High)
      if (selectedEmotions.length === 0) {
        selectedEmotions.push("positivity:high");
      }
      
      // Get the speed setting
      const speed = formData.get("speed") as string || "normal";
      
      // Create new FormData to ensure we have clean data
      const processedFormData = new FormData();
      processedFormData.append("text", text);
      processedFormData.append("model", model);
      processedFormData.append("language", language);
      processedFormData.append("speed", speed);
      for (const emotion of selectedEmotions) {
        processedFormData.append("emotions", emotion);
      }

      const audioBuffer = await speak(processedFormData);

      if (audioBuffer) {
        // Convert ArrayBuffer to Blob
        const blob = new Blob([audioBuffer], { type: "audio/mp3" });
        
        setState({
          isPlaying: true,
          audioBlob: blob,
          audioText: text,
        });

        // Create object URL for playback
        const url = URL.createObjectURL(blob);

        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play().catch((error) => {
            console.error("Error playing audio:", error);
            setState((prev) => ({ ...prev, isPlaying: false }));
          });
        }
      } else {
        setState((prev) => ({ ...prev, isPlaying: false }));
      }
    } catch (error) {
      console.error("Error during TTS or playback:", error);
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  const downloadAudio = (model: string, language: string) => {
    if (!state.audioBlob) return;

    // Create a safe filename from the input text
    const filename = `${state.audioText
      .substring(0, 20)
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_${model}_${language}.mp3`;

    // Create a download link using the blob URL
    const url = URL.createObjectURL(state.audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return {
    state,
    generateSpeech,
    downloadAudio,
  };
}
