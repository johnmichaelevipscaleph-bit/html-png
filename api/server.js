// Optimized for serverless: using puppeteer-core + @sparticuz/chromium
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createBrowser } = require("./browser");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
});
app.use("/api/", limiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
  });
});

// API documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    name: "HTML to PNG API",
    version: "1.0.0",
    description: "Convert HTML content to PNG images using Puppeteer",
    endpoints: {
      "POST /api/convert": {
        description: "Convert HTML to PNG",
        parameters: {
          htmlContent: "string (required) - HTML content to convert",
          options: "object (optional) - Conversion options",
          "options.width": "number (optional) - Viewport width (default: 1200)",
          "options.height":
            "number (optional) - Viewport height (default: 800)",
          "options.scale":
            "number (optional) - Device scale factor (default: 2)",
          "options.fullPage":
            "boolean (optional) - Capture full page (default: true)",
          "options.format":
            "string (optional) - Image format: png, jpeg (default: png)",
          "options.quality":
            "number (optional) - Image quality 0-1 (for jpeg, default: 0.8)",
        },
        response: {
          success: "boolean",
          dataUrl: "string - Base64 encoded image",
          method: "string - Conversion method used",
          dimensions: "object - Image dimensions",
        },
      },
      "GET /health": {
        description: "Health check endpoint",
      },
    },
    examples: {
      curl: 'curl -X POST http://localhost:3000/api/convert \\\n  -H "Content-Type: application/json" \\\n  -d \'{"htmlContent": "<h1>Hello World</h1>"}\'',
      javascript:
        'fetch("/api/convert", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ htmlContent: "<h1>Hello World</h1>" })\n})',
    },
  });
});

// Main conversion endpoint
app.post("/api/convert", async (req, res) => {
  const startTime = Date.now();

  try {
    const { htmlContent, options = {} } = req.body;

    // Validation
    if (!htmlContent) {
      return res.status(400).json({
        success: false,
        error: "HTML content is required",
        code: "MISSING_HTML_CONTENT",
      });
    }

    if (typeof htmlContent !== "string") {
      return res.status(400).json({
        success: false,
        error: "HTML content must be a string",
        code: "INVALID_HTML_TYPE",
      });
    }

    // Sanitize HTML content length
    if (htmlContent.length > 1000000) {
      // 1MB limit
      return res.status(400).json({
        success: false,
        error: "HTML content too large (max 1MB)",
        code: "HTML_TOO_LARGE",
      });
    }

    // Launch Puppeteer browser optimized for serverless
    const browser = await createBrowser({
      timeout: 30000,
    });

    const page = await browser.newPage();

    // Set viewport size
    await page.setViewport({
      width: options.width || 1200,
      height: options.height || 800,
      deviceScaleFactor: options.scale || 2,
    });

    // Set HTML content with timeout
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait a bit for any dynamic content
    await page.waitForTimeout(1000);

    // Take screenshot
    const screenshot = await page.screenshot({
      type: options.format || "png",
      fullPage: options.fullPage !== false,
      quality: options.quality || (options.format === "jpeg" ? 0.8 : undefined),
    });

    // Get page dimensions for response
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }));

    // Close browser
    await browser.close();

    // Convert to base64
    const base64Image = screenshot.toString("base64");
    const dataUrl = `data:image/${
      options.format || "png"
    };base64,${base64Image}`;

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      dataUrl: dataUrl,
      method: "puppeteer",
      dimensions: dimensions,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Conversion error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to convert HTML to PNG",
      details: error.message,
      code: "CONVERSION_FAILED",
      timestamp: new Date().toISOString(),
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    code: "NOT_FOUND",
    availableEndpoints: ["/api/convert", "/api", "/health"],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HTML to PNG API server running on port ${PORT}`);
  console.log(`📖 API documentation available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});
