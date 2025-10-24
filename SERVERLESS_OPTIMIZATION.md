# HTML to PNG Converter - Serverless Optimized

This project has been optimized for serverless environments like Vercel and AWS Lambda using `puppeteer-core` and `@sparticuz/chromium`.

## Key Optimizations

- **puppeteer-core**: Lightweight Puppeteer without bundled Chromium
- **@sparticuz/chromium**: Optimized Chromium binary for serverless environments
- **Reusable browser helper**: Consistent Chromium configuration across all APIs
- **Docker optimization**: Minimal dependencies, no large Chromium downloads

## Architecture

### Next.js API Route
- **File**: `src/pages/api/convert-to-png.js`
- **Helper**: `src/utils/browser.js`
- **Optimized for**: Vercel serverless functions

### Standalone Express API
- **File**: `api/server.js`
- **Helper**: `api/browser.js`
- **Optimized for**: AWS Lambda, Docker containers

## Browser Configuration

Both APIs use the same optimized browser configuration:

```javascript
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});
```

## Deployment

### Vercel
- No additional configuration needed
- `@sparticuz/chromium` handles Chromium binary automatically

### AWS Lambda
- Use the standalone API server
- Ensure Lambda has sufficient memory (512MB+ recommended)

### Docker
- Optimized Dockerfile with minimal dependencies
- No Chromium binary download during build

## Features Maintained

- ✅ HTML to PNG conversion
- ✅ Dynamic content rendering
- ✅ Font loading (including Font Awesome)
- ✅ Custom viewport sizing
- ✅ High-quality screenshots
- ✅ Error handling and validation

## Performance Benefits

- **Faster cold starts**: Smaller bundle size
- **Reduced memory usage**: Optimized Chromium binary
- **Better scalability**: Serverless-optimized configuration
- **Consistent behavior**: Same configuration across environments
