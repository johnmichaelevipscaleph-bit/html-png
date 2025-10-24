# HTML to PNG API

A standalone REST API for converting HTML content to PNG images using Puppeteer.

## Features

- 🚀 **Fast Conversion**: Uses Puppeteer for high-quality HTML to PNG conversion
- 🔒 **Secure**: Built-in rate limiting, CORS protection, and input validation
- 📱 **Flexible**: Supports custom viewport sizes, scaling, and image formats
- 🛡️ **Robust**: Comprehensive error handling and graceful shutdown
- 📊 **Monitoring**: Health check endpoint and processing time tracking

## Quick Start

### Installation

```bash
cd api
npm install
```

### Running the API

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### POST `/api/convert`

Convert HTML content to PNG image.

**Request Body:**

```json
{
  "htmlContent": "<h1>Hello World</h1>",
  "options": {
    "width": 1200,
    "height": 800,
    "scale": 2,
    "format": "png",
    "quality": 0.8,
    "fullPage": true
  }
}
```

**Parameters:**

- `htmlContent` (string, required): HTML content to convert
- `options` (object, optional): Conversion options
  - `width` (number): Viewport width (default: 1200)
  - `height` (number): Viewport height (default: 800)
  - `scale` (number): Device scale factor (default: 2)
  - `format` (string): Image format - "png" or "jpeg" (default: "png")
  - `quality` (number): Image quality 0-1 (for JPEG, default: 0.8)
  - `fullPage` (boolean): Capture full page (default: true)

**Response:**

```json
{
  "success": true,
  "dataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "method": "puppeteer",
  "dimensions": {
    "width": 1200,
    "height": 800
  },
  "processingTime": "1250ms",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET `/api`

Get API documentation and examples.

### GET `/health`

Health check endpoint.

## Usage Examples

### cURL

```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"htmlContent": "<h1>Hello World</h1><p>This is a test</p>"}'
```

### JavaScript/Fetch

```javascript
const response = await fetch("http://localhost:3000/api/convert", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    htmlContent: "<h1>Hello World</h1><p>This is a test</p>",
    options: {
      width: 1200,
      height: 800,
      scale: 2,
    },
  }),
});

const result = await response.json();
console.log(result.dataUrl); // Base64 encoded image
```

### Python

```python
import requests
import base64

response = requests.post('http://localhost:3000/api/convert', json={
    'htmlContent': '<h1>Hello World</h1><p>This is a test</p>',
    'options': {
        'width': 1200,
        'height': 800,
        'scale': 2
    }
})

result = response.json()
if result['success']:
    # Save image
    image_data = result['dataUrl'].split(',')[1]  # Remove data:image/png;base64,
    with open('output.png', 'wb') as f:
        f.write(base64.b64decode(image_data))
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `RATE_LIMIT`: Rate limit per 15 minutes (default: 100)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins (default: \*)

## Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Common error codes:

- `MISSING_HTML_CONTENT`: HTML content is required
- `INVALID_HTML_TYPE`: HTML content must be a string
- `HTML_TOO_LARGE`: HTML content exceeds size limit
- `CONVERSION_FAILED`: Conversion process failed
- `INTERNAL_ERROR`: Server error

## Deployment

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

### Heroku

1. Create a `Procfile`:

```
web: npm start
```

2. Deploy:

```bash
git push heroku main
```

### Vercel

1. Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Configurable via `RATE_LIMIT` environment variable
- Returns 429 status code when exceeded

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Validates HTML content
- **Size Limits**: Prevents large payloads

## Performance

- **Compression**: Gzip compression enabled
- **Puppeteer Optimization**: Optimized browser launch args
- **Memory Management**: Proper browser cleanup
- **Timeout Handling**: 30-second timeouts for operations

## License

MIT
