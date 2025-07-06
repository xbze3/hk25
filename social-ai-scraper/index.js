import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { scrape } from './scraper.js';
import { isRelevant } from './aiFilter.js';
import { sendAlertEmail } from './mailer.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store matched posts in memory
const storedIncidents = [];

app.post('/scan', async (req, res) => {
  const { url, keywords = [], email, limit = 10 } = req.body;

  if (!url || !Array.isArray(keywords)) {
    return res.status(400).json({ error: 'Invalid request: url and keywords are required.' });
  }

  console.log(`🔍 Starting scan for URL: ${url} with keywords: ${keywords.join(', ')}`);

  try {
    const rawPosts = await scrape(url, [], limit * 3);
    console.log(`📄 Fetched ${rawPosts.length} posts from scraper.`);

    const matchedPosts = [];

    for (const post of rawPosts) {
      if (matchedPosts.length >= limit) break;

      const relevant = await isRelevant(post.description, keywords);
      console.log(`🧠 AI filter result: "${post.description.slice(0, 50)}..." => ${relevant}`);

      if (relevant) {
        matchedPosts.push(post);
        storedIncidents.push(post); 

        if (email) {
          try {
            await sendAlertEmail(
              email,
              `⚠️ Relevant post detected:\n\n${post.description}\n\nLink: ${post.link || 'No link available'}`
            );
            console.log(`✅ Alert email sent to ${email}`);
          } catch (err) {
            console.error('❌ Error sending alert email:', err.message);
          }
        }

        io.emit('alert', { ...post, timestamp: new Date().toISOString() });
        console.log(`📡 Real-time alert emitted.`);
      }
    }

    console.log(`✅ Scan complete. Found ${matchedPosts.length} relevant posts.`);
    res.json({ match: matchedPosts.length > 0, posts: matchedPosts });

  } catch (err) {
    console.error('[SCAN ERROR]', err);
    res.status(500).json({ error: 'Scraping or filtering failed.' });
  }
});

// ✅ Add GET /incidents to serve stored incidents to frontend
app.get('/incidents', (req, res) => {
  res.json(storedIncidents);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
