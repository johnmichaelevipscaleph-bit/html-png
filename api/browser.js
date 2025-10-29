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
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  
  let puppeteerError = null;
  
  // In development, try full puppeteer first (more reliable on local machines)
  // In production/serverless, use @sparticuz/chromium
  if (!isServerless) {
    // Development mode: try full puppeteer package first
    try {
      // Use dynamic require to prevent bundlers from resolving at build time
      // eslint-disable-next-line no-eval
      const puppeteerLocal = eval('require')('puppeteer');
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
    } catch (error) {
      // If full puppeteer fails, try @sparticuz/chromium as fallback
      puppeteerError = error;
      console.log('Full puppeteer failed, trying @sparticuz/chromium:', error.message);
    }
  }
  
  // Use @sparticuz/chromium (serverless or fallback in dev)
  try {
    let executablePath;
    try {
      executablePath = await chromium.executablePath();
    } catch (execPathError) {
      throw new Error(`chromium.executablePath() failed: ${execPathError.message}`);
    }
    
    if (!executablePath) {
      throw new Error('chromium.executablePath() returned null or undefined');
    }
    
    console.log('Using @sparticuz/chromium at:', executablePath);
    
    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
      ...options,
    });
  } catch (chromiumError) {
    // Last resort: try puppeteer-core with system Chrome if path provided
    if (!isServerless && process.env.PUPPETEER_EXECUTABLE_PATH) {
      try {
        return await puppeteer.launch({
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
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
      } catch (systemError) {
        throw new Error(
          `All browser launch methods failed. ` +
          `Full puppeteer: ${puppeteerError?.message || 'N/A'}, ` +
          `@sparticuz/chromium: ${chromiumError.message}, ` +
          `System Chrome: ${systemError.message}. ` +
          `Install puppeteer or set PUPPETEER_EXECUTABLE_PATH.`
        );
      }
    }
    
    throw new Error(
      `Failed to launch browser with @sparticuz/chromium: ${chromiumError.message}. ` +
      (puppeteerError ? `Full puppeteer also failed: ${puppeteerError.message}. ` : '') +
      `In development, install the full 'puppeteer' package or set PUPPETEER_EXECUTABLE_PATH.`
    );
  }
}

module.exports = { createBrowser };
