# Vercel Deployment Guide

This project is **ready to deploy to Vercel**! It's already optimized for serverless environments.

## Quick Deploy

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Vercel Dashboard](https://vercel.com/new)
3. Vercel will auto-detect Next.js and deploy

### Option 3: Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Click "Deploy"

## Configuration

The project includes a `vercel.json` file that configures:
- **Memory**: 1024MB (Pro plan) or 128MB (Hobby plan)  
- **Max Duration**: 30 seconds (default for API routes)

### Upgrading Memory (Recommended)

The HTML to PNG conversion is memory-intensive. For better performance:

1. **Pro Plan**: Automatically gets 1024MB per function
2. **Hobby Plan**: 128MB (may cause timeouts for large conversions)

To upgrade, go to your Vercel project settings and upgrade to Pro plan.

## How It Works on Vercel

1. **Automatic Detection**: When `process.env.VERCEL` is detected, the browser helper automatically uses `@sparticuz/chromium` (optimized for serverless)
2. **No Configuration Needed**: The `browser.js` file automatically switches to serverless-optimized Chromium
3. **API Routes**: Your Next.js API routes in `src/pages/api/` are automatically deployed as serverless functions

## Environment Variables

No environment variables are required! The app automatically detects the Vercel environment.

Optional (for advanced usage):
- `PUPPETEER_EXECUTABLE_PATH`: Not needed on Vercel (only for local dev)

## Build Configuration

The project uses Next.js 16 with Turbopack. Vercel will:
- Automatically detect Next.js
- Run `npm run build` during deployment
- Optimize the build with Turbopack
- Externalize server-side packages (`puppeteer`, `puppeteer-core`, `@sparticuz/chromium`)

## Testing After Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Test the conversion API: `https://your-app.vercel.app/api/health`
3. Try converting some HTML to PNG

## Troubleshooting

### Memory Errors
If you see memory errors:
- Upgrade to Vercel Pro plan (1024MB)
- Reduce HTML content size
- Use smaller viewport dimensions

### Timeout Errors
- Default timeout is 30 seconds
- Reduce wait times in the conversion logic
- Optimize HTML content size

### Build Errors
- Make sure all dependencies are in `package.json`
- Check that `next.config.mjs` has `serverExternalPackages` configured
- Ensure Node.js version is compatible (16+)

## Cost Considerations

- **Hobby Plan**: Free, but limited to 128MB memory (may be insufficient)
- **Pro Plan**: $20/month, includes 1024MB memory per function
- **Enterprise**: Custom pricing for higher limits

## Performance Tips

1. **Use Pro Plan**: 1024MB memory reduces failures significantly
2. **Optimize HTML**: Remove unnecessary content before conversion
3. **Cache Results**: Consider caching converted images
4. **Reduce Timeout Waits**: The current 2-second wait might be reduced

## Support

For Vercel-specific issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- [Next.js Documentation](https://nextjs.org/docs)

