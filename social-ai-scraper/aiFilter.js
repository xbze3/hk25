import fetch from 'node-fetch';
/**
 * Uses LLaMA3 (via Ollama) to determine whether a post is relevant based on provided keywords.
 * Sends a natural language prompt and expects a strict "yes" or "no" response.
 *
 * @param {string} postText - The text content of the post to evaluate.
 * @param {string[]} keywords - List of keywords to assess relevance against.
 * @returns {Promise<boolean>} - Returns true if the post is deemed relevant, false otherwise.
 */
export async function isRelevant(postText, keywords) {
  const prompt = `Please answer ONLY with "yes" or "no" (without quotes). Do NOT provide any explanation.

Question: Does this post mention any of the following keywords: ${keywords.join(', ')}?

Text:
"""
${postText}
"""`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); 

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma:2b',
        prompt,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama API returned status ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const answer = (data?.response || '').trim().toLowerCase();

    if (answer.includes('yes')) return true;
    if (answer.includes('no')) return false;

    console.warn(`[Ollama API Warning] Unexpected response: "${answer}"`);
    return false;

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('[Ollama API Error] Request timed out');
    } else {
      console.error('[Ollama API Error]', error);
    }
    return false;
  }
}
