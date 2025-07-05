import fetch from 'node-fetch';

// List of news URLs to scan
const urls = [
  'https://guyanachronicle.com',
  'https://stabroeknews.com',
];

// Email to receive notifications or results
const email = 'clarencelucius98@gmail.com';

// Maximum number of relevant posts to retrieve per site
const limit = 5;

// Keywords to match against article content
const keywords = [
  'accident',
  'injury',
  'workplace',
  'worksite',
  'safety violation',
  'fall',
  'hazard',
  'incident',
  'fire',
  'explosion',
  'death',
  'emergency',
  'medical',
  'fatality',
];

// Sends a POST request to the local scanner API for a single URL
async function sendPostRequestForUrl(urlToScan) {
  try {
    const response = await fetch('http://localhost:3000/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: urlToScan,
        email,
        limit,
        keywords,
      }),
    });

    if (!response.ok) {
      console.error(`Failed to send POST request for ${urlToScan}:`, response.statusText);
      return;
    }

    const data = await response.json();
    console.log(`[${new Date().toLocaleTimeString()}] ${urlToScan} => found ${data.posts.length} matching posts.`);
  } catch (error) {
    console.error(`Error during POST request for ${urlToScan}:`, error);
  }
}

// Sends POST requests concurrently for all configured URLs
async function sendPostRequests() {
  await Promise.all(urls.map(url => sendPostRequestForUrl(url)));
}

// Run immediately on script start
sendPostRequests();

// Schedule to run every 3 minutes (180,000 milliseconds)
setInterval(sendPostRequests, 180000);
