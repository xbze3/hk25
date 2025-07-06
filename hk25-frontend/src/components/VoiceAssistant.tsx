import  { useState } from 'react';


declare global {
  interface Window {
   // webkitSpeechRecognition: any;
  }
}

export default function VoiceAssistant() {
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      sendToAI(text);
    };

    recognition.onerror = () => {
      setError('Speech recognition failed. Try again.');
    };

    recognition.start();
  };

  const sendToAI = async (text: string) => {
    try {
      const res = await fetch('http://localhost:3000/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setAiResponse(data.reply);
      speak(data.reply);
    } catch {
      setError('Failed to fetch AI response.');
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <button onClick={startListening}>🎤 Speak</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><strong>You said:</strong> {transcript}</p>
      <p><strong>AI:</strong> {aiResponse}</p>
    </div>
  );
}
