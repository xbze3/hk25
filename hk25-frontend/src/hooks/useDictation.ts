import { useState } from "react";

// Define missing interfaces if TypeScript doesn't have them
interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}

export const useDictation = () => {
    const [text, setText] = useState("");
    const [listening, setListening] = useState(false);

    const startDictation = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser doesn’t support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Dictation error:", event.error);
            setListening(false);
        };

        recognition.start();
    };

    return { text, startDictation, listening };
};
