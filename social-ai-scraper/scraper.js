import { chromium } from 'playwright';
import { isRelevant } from './aiFilter.js';

// Filters posts using AI to check for relevance based on keywords and a limit
async function filterWithAI(posts, keywords, limit) {
  const filtered = [];
  for (const post of posts) {
    if (filtered.length >= limit) break;
    const relevant = await isRelevant(post.description, keywords);
    console.log(`AI relevance check for post: "${post.description.slice(0, 60)}..." => ${relevant}`);
    if (relevant) filtered.push(post);
  }
  console.log(`Filtered ${filtered.length} posts after AI relevance check.`);
  return filtered;
}

// Normalizes a possibly relative link to an absolute URL based on base URL
function normalizeLink(href, baseUrl) {
  try {
    return new URL(href, baseUrl).href;
  } catch {
    return href;
  }
}

// Checks if any of the keywords appear in the given text
function textContainsKeywords(text, keywords) {
  const lowerText = text.toLowerCase();
  return keywords.some(kw => lowerText.includes(kw.toLowerCase()));
}

// Scraper for Guyana Chronicle site
export async function scrapeGuyanaChronicle(url, keywords = [], limit = 10) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log(`Navigating to Guyana Chronicle URL: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000); // wait for page to load content

    const baseUrl = new URL(url).href;

    // Extract posts from page content
    const posts = await page.$$eval('article, .news-item', (items, baseHref) =>
      items
        .map(item => {
          const headline =
            item.querySelector('div')?.innerText?.trim() ||
            item.querySelector('h2')?.innerText?.trim() ||
            item.querySelector('strong')?.innerText?.trim() ||
            '';

          const summary =
            item.querySelector('p')?.innerText?.trim() ||
            headline;

          const linkEl = item.querySelector('a[href]');
          const link = linkEl
            ? (linkEl.href.startsWith('http')
              ? linkEl.href
              : new URL(linkEl.getAttribute('href'), baseHref).href)
            : null;

          return {
            description: (summary || headline).slice(0, 500),
            link,
          };
        })
        .filter(post => post.description),
      baseUrl
    );

    console.log(`Scraped ${posts.length} posts from Guyana Chronicle.`);
    posts.forEach((p, i) => console.log(`Post ${i + 1}: "${p.description.slice(0, 80)}..." | Link: ${p.link}`));

    // Filter posts by keywords
    let filtered = keywords.length
      ? posts.filter(post => textContainsKeywords(post.description, keywords))
      : posts;

    console.log(`After keyword text filtering: ${filtered.length} posts.`);

    // Use AI to filter further if keywords provided
    if (keywords.length) {
      filtered = await filterWithAI(filtered, keywords, limit);
    } else {
      filtered = filtered.slice(0, limit);
    }

    console.log(`Returning ${filtered.length} posts from Guyana Chronicle.`);
    await browser.close();
    return filtered;
  } catch (e) {
    await browser.close();
    console.error('Error scraping Guyana Chronicle:', e);
    throw e;
  }
}

// Scraper for Stabroek News site
export async function scrapeStabroekNews(url, keywords = [], limit = 10) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log(`Navigating to Stabroek News URL: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000); // wait for page to load content

    const baseUrl = new URL(url).href;

    // Extract posts from page content
    const posts = await page.$$eval('div, article, .article, .post, .news-item', (articles, baseHref) =>
      articles
        .map(article => {
          const headline =
            article.querySelector('h2')?.innerText?.trim() ||
            article.querySelector('div')?.innerText?.trim() ||
            article.querySelector('strong')?.innerText?.trim() ||
            '';

          const summary =
            article.querySelector('p')?.innerText?.trim() ||
            headline;

          const linkEl = article.querySelector('a[href]');
          const link = linkEl
            ? (linkEl.href.startsWith('http')
              ? linkEl.href
              : new URL(linkEl.getAttribute('href'), baseHref).href)
            : null;

          return {
            description: (summary || headline).slice(0, 500),
            link,
          };
        })
        .filter(post => post.description),
      baseUrl
    );

    console.log(`Scraped ${posts.length} posts from Stabroek News.`);
    posts.forEach((p, i) => console.log(`Post ${i + 1}: "${p.description.slice(0, 80)}..." | Link: ${p.link}`));

    // Filter posts by keywords
    let filtered = keywords.length
      ? posts.filter(post => textContainsKeywords(post.description, keywords))
      : posts;

    console.log(`After keyword text filtering: ${filtered.length} posts.`);

    // Use AI to filter further if keywords provided
    if (keywords.length) {
      filtered = await filterWithAI(filtered, keywords, limit);
    } else {
      filtered = filtered.slice(0, limit);
    }

    console.log(`Returning ${filtered.length} posts from Stabroek News.`);
    await browser.close();
    return filtered;
  } catch (e) {
    await browser.close();
    console.error('Error scraping Stabroek News:', e);
    throw e;
  }
}

// Dispatcher function to route based on hostname
export async function scrape(url, keywords = [], limit = 10) {
  const hostname = new URL(url).hostname.replace('www.', '').toLowerCase();
  console.log(`Dispatching scrape for hostname: ${hostname}`);

  if (hostname.includes('guyanachronicle.com')) {
    return await scrapeGuyanaChronicle(url, keywords, limit);
  } else if (hostname.includes('stabroeknews.com')) {
    return await scrapeStabroekNews(url, keywords, limit);
  } else {
    throw new Error(`No scraper configured for site: ${hostname}`);
  }
}

// Run both scrapers every 30 hours
export async function runScheduledScrapes() {
  const urls = [
    'https://guyanachronicle.com',
    'https://stabroeknews.com',
  ];
  const keywords = ['election', 'government', 'policy'];
  const limit = 10;

  async function run() {
    console.log(`\n=== Scraping run started at ${new Date().toISOString()} ===`);
    for (const url of urls) {
      try {
        const posts = await scrape(url, keywords, limit);
        console.log(`Scraped ${posts.length} relevant posts from ${url}`);
        // Add any saving or processing logic here if needed
      } catch (err) {
        console.error(`Error scraping ${url}:`, err);
      }
    }
    console.log(`=== Scraping run ended at ${new Date().toISOString()} ===\n`);
  }

  // Run immediately once
  await run();

  setInterval(run, 30 * 60 * 60 *1000); 
}
