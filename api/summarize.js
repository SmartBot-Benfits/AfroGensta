// api/summarize.js
// Vercel Serverless Function - Gemini summarizer with header auth & rate limiting
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 20;
const rateByIp = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const clientKey = req.headers['x-client-key'] || req.headers['x-api-key'] || '';
    const CLIENT_KEY = process.env.CLIENT_KEY || '';
    if (!CLIENT_KEY || clientKey !== CLIENT_KEY) {
      return res.status(401).json({ error: 'Unauthorized: invalid client key' });
    }

    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    const now = Date.now();
    const entry = rateByIp.get(ip) || { ts: now, count: 0 };
    if (now - entry.ts > RATE_LIMIT_WINDOW_MS) { entry.ts = now; entry.count = 0; }
    entry.count++;
    rateByIp.set(ip, entry);
    if (entry.count > RATE_LIMIT_MAX) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const text = (body.text || '').toString().trim();
    if (!text || text.length < 10) return res.status(400).json({ error: "Missing or too-short 'text' in request body" });

    const GEMINI_KEY = process.env.GEMINI_KEY;
    if (!GEMINI_KEY) return res.status(500).json({ error: 'Server misconfigured: missing GEMINI_KEY' });

    const prompt = `Summarize the following Afrobeat music news or artist update in 3 concise bullet points (for fans), and finish with one short trading insight for the AfroGenstas market:\n\n${text}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(GEMINI_KEY)}`;

    const payload = { input: { text: prompt }, candidate_count: 1, temperature: 0.2 };

    const r = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error('Gemini error:', r.status, errText);
      return res.status(502).json({ error: 'Gemini request failed', details: errText });
    }

    const j = await r.json();
    const summary = j?.candidates?.[0]?.content?.[0]?.text || j?.candidates?.[0]?.content?.parts?.[0]?.text || j?.output?.text || '';
    return res.status(200).json({ summary: (summary || '').toString() });
  } catch (err) {
    console.error('summarize handler error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
