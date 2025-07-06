import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

app.post('/api/ai-chat', async (req, res) => {
  const { message } = req.body;

  const completion = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: message }],
  });

  const reply = completion.data.choices[0].message.content;
  res.json({ reply });
});

app.listen(3000, () => console.log('Server running on port 3000'));
