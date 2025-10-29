// Next.js API route for server-side HTML to PNG conversion
// Uses Puppeteer which supports backdrop-filter and modern CSS

// Import browser creation function
const { createBrowser } = require("../../../api/browser");

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST,OPTIONS');
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  const startTime = Date.now();
  let browser = null;

  try {
    const { htmlContent, options = {} } = req.body;

    // Validation
    if (!htmlContent) {
      return res.status(400).json({
        success: false,
        error: 'HTML content is required',
        code: 'MISSING_HTML_CONTENT',
      });
    }

    if (typeof htmlContent !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'HTML content must be a string',
        code: 'INVALID_HTML_TYPE',
      });
    }

    // Sanitize HTML content length
    if (htmlContent.length > 1000000) {
      // 1MB limit
      return res.status(400).json({
        success: false,
        error: 'HTML content too large (max 1MB)',
        code: 'HTML_TOO_LARGE',
      });
    }

    // Launch Puppeteer browser optimized for serverless
    browser = await createBrowser({
      timeout: 30000,
    });

    const page = await browser.newPage();

    // Set viewport size
    await page.setViewport({
      width: options.width || 1080,
      height: options.height || 1080,
      deviceScaleFactor: options.scale || 2,
    });

    // Set HTML content with timeout
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait a bit for any dynamic content and CSS to render
    await page.waitForTimeout(2000);

    // Take screenshot
    const screenshot = await page.screenshot({
      type: options.format || 'png',
      fullPage: options.fullPage !== false,
      quality: options.quality || (options.format === 'jpeg' ? 0.8 : undefined),
    });

    // Get page dimensions for response
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }));

    // Close browser
    await browser.close();
    browser = null;

    // Convert to base64
    const base64Image = screenshot.toString('base64');
    const dataUrl = `data:image/${options.format || 'png'};base64,${base64Image}`;

    const processingTime = Date.now() - startTime;

    res.status(200).json({
      success: true,
      dataUrl: dataUrl,
      method: 'puppeteer',
      dimensions: dimensions,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Conversion error:', error);
    console.error('Error stack:', error.stack);

    // Ensure browser is closed on error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    // Return detailed error information
    const errorMessage = error.message || 'Unknown error occurred';
    const errorDetails = process.env.NODE_ENV === 'development' 
      ? error.stack 
      : errorMessage;

    res.status(500).json({
      success: false,
      error: 'Failed to convert HTML to PNG',
      details: errorMessage,
      debug: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      code: 'CONVERSION_FAILED',
      timestamp: new Date().toISOString(),
    });
  }
}

// Ensure Node.js runtime on Vercel (not Edge) and allow larger JSON bodies
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
  runtime: 'nodejs',
};

