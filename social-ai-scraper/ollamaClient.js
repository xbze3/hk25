import fetch from 'node-fetch';

/**
 * Sends a prompt to the local LLaMA 3 model via Ollama's API and returns the response.
 *
 * @param {string} prompt - The input prompt to send to the model.
 * @returns {Promise<string>} - The model's generated response, or an error message if the request fails.
 */
export async function queryLlama3(prompt) {
  try {
    // Send POST request to Ollama's local inference API
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',     // Model name must match the one pulled via Ollama (e.g., llama3)
        prompt,              // The text input to be processed
        stream: false        // Return the full response at once (non-streaming)
      })
    });

    const data = await res.json();
    return data.response;
  } catch (error) {
    console.error('[Ollama Error]', error.message);
    return 'AI Error: could not generate a response.';
  }
}
