// Simple health check endpoint
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const memUsage = process.memoryUsage();
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL ? "Vercel" : "Local",
      nodeVersion: process.version,
      memory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
      },
      limits: {
        maxMemory: process.env.VERCEL ? "1024MB (Pro) or 128MB (Hobby)" : "No limit",
        maxDuration: "30s"
      }
    });
  } catch (error) {
    res.status(500).json({
      error: "Health check failed",
      details: error.message,
    });
  }
}
