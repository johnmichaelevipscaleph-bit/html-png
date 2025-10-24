// Optimized for serverless: using puppeteer-core + @sparticuz/chromium
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

/**
 * Creates a Puppeteer browser instance optimized for serverless environments
 * @param {Object} options - Additional launch options
 * @returns {Promise<Object>} Puppeteer browser instance
 */
async function createBrowser(options = {}) {
  // Check if we're in a serverless environment
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';
  
  if (isServerless) {
    // Use @sparticuz/chromium for serverless environments
    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ...options,
    });
  } else {
    // Use local Puppeteer for development
    const puppeteerLocal = require('puppeteer');
    return await puppeteerLocal.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
      ...options,
    });
  }
}

module.exports = { createBrowser };
