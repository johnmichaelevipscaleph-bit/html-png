// Simple test endpoint to verify API deployment
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      message: 'API is working!',
      method: req.method,
      timestamp: new Date().toISOString(),
      url: req.url,
      headers: {
        'user-agent': req.headers['user-agent'],
        'origin': req.headers['origin'],
        'referer': req.headers['referer']
      }
    });
    return;
  }

  if (req.method === 'POST') {
    res.status(200).json({
      message: 'POST request received!',
      method: req.method,
      body: req.body,
      timestamp: new Date().toISOString()
    });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
