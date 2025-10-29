// Next.js API route for server-side HTML to PNG conversion
// Uses Puppeteer which supports backdrop-filter and modern CSS

// Import browser creation function
const { createBrowser } = require("../../../api/browser");

// Next.js API route configuration for Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  // Log detailed request info for debugging
  const requestInfo = {
    method: req.method,
    url: req.url,
    methodType: typeof req.method,
    headers: {
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent'],
      'x-forwarded-method': req.headers['x-forwarded-method'],
      'x-http-method-override': req.headers['x-http-method-override'],
    },
    hasBody: !!req.body,
  };
  
  console.log(`[API] Request received:`, JSON.stringify(requestInfo, null, 2));
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('[API] Handling OPTIONS preflight');
    res.status(200).end();
    return;
  }

  // Allow GET for testing the endpoint is accessible
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'API endpoint is accessible',
      method: 'GET',
      availableMethods: ['POST', 'OPTIONS'],
      timestamp: new Date().toISOString(),
      requestInfo: requestInfo,
    });
  }

  // Check for POST method (case-insensitive and check alternate headers)
  const methodUpper = String(req.method || '').toUpperCase();
  const isPost = methodUpper === 'POST' || 
                 req.headers['x-http-method-override']?.toUpperCase() === 'POST' ||
                 req.headers['x-forwarded-method']?.toUpperCase() === 'POST';

  if (!isPost) {
    console.log(`[API] Method not allowed. Received: "${req.method}" (${typeof req.method})`);
    console.log(`[API] Full request object:`, {
      method: req.method,
      methodType: typeof req.method,
      methodValue: req.method,
      allHeaders: req.headers,
    });
    
    // Ensure JSON response is sent
    const errorResponse = {
      success: false,
      error: 'Method not allowed. Use POST.',
      receivedMethod: req.method,
      methodUpper: methodUpper,
      methodType: typeof req.method,
      availableMethods: ['POST', 'GET', 'OPTIONS'],
      debug: requestInfo,
      timestamp: new Date().toISOString(),
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Allow', 'POST,GET,OPTIONS');
    return res.status(405).json(errorResponse);
  }

  console.log('[API] Processing POST request');

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

    // Ensure we send a response
    if (!res.headersSent) {
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
}


