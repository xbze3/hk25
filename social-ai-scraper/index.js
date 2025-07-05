import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { scrape } from './scraper.js';  // Scraper fetches posts from news sites (without AI filtering)
import { isRelevant } from './aiFilter.js';  // AI-based keyword relevance filter
import { sendAlertEmail } from './mailer.js';  // Email notification sender

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

/**
 * POST /scan
 * Triggers scraping from a given news URL, applies AI keyword relevance filtering,
 * emits real-time alerts via Socket.IO, and optionally sends email notifications.
 *
 * Request body:
 * {
 *   url: string (required),
 *   keywords: string[] (required),
 *   email: string (optional),
 *   limit: number (optional, default: 10)
 * }
 */
app.post('/scan', async (req, res) => {
  const { url, keywords = [], email, limit = 10 } = req.body;

  // Basic request validation
  if (!url || !Array.isArray(keywords)) {
    return res.status(400).json({ error: 'Invalid request: url and keywords are required.' });
  }

  console.log(`🔍 Starting scan for URL: ${url} with keywords: ${keywords.join(', ')}`);

  try {
    // Fetch a broader set of posts from the site (to allow filtering down)
    const rawPosts = await scrape(url, [], limit * 3);
    console.log(`📄 Fetched ${rawPosts.length} posts from scraper.`);

    const matchedPosts = [];

    for (const post of rawPosts) {
      if (matchedPosts.length >= limit) break;

      // Use AI model to determine if the post is relevant
      const relevant = await isRelevant(post.description, keywords);
      console.log(`🧠 AI filter result for post: "${post.description.slice(0, 50)}..." => ${relevant}`);

      if (relevant) {
        matchedPosts.push(post);

        // Send email alert if email was provided
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

        // Emit real-time alert to connected Socket.IO clients
        io.emit('alert', { ...post, timestamp: new Date().toISOString() });
        console.log(`📡 Real-time alert emitted for post.`);
      }
    }

    console.log(`✅ Scan complete. Found ${matchedPosts.length} relevant posts.`);
    res.json({ match: matchedPosts.length > 0, posts: matchedPosts });

  } catch (err) {
    console.error('[SCAN ERROR]', err);
    res.status(500).json({ error: 'Scraping or filtering failed.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
