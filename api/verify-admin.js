const crypto = require('crypto');

// Server-side Secret for HMAC signing (kept strictly on server)
const SERVER_SECRET = process.env.ADMIN_SECRET_KEY || 'ziproo-sovereign-kernel-vault-key-2026';

// Server-side configured Admin accounts
const SERVER_ADMINS = [
  {
    email: (process.env.ADMIN_EMAIL || 'admin@ziproo.com').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'Admin',
    name: 'Admin Administrator'
  }
];

function generateToken(email, role) {
  const timestamp = Date.now();
  const payload = `${email}:${role}:${timestamp}`;
  const signature = crypto.createHmac('sha256', SERVER_SECRET).update(payload).digest('hex');
  return Buffer.from(JSON.stringify({ email, role, timestamp, sig: signature })).toString('base64');
}

function verifyToken(token) {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const parsed = JSON.parse(raw);
    const { email, role, timestamp, sig } = parsed;

    // Check expiration (24 hours)
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      return { valid: false, error: 'Token expired' };
    }

    const expectedSig = crypto.createHmac('sha256', SERVER_SECRET).update(`${email}:${role}:${timestamp}`).digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return { valid: true, email, role };
    }
    return { valid: false, error: 'Invalid token signature' };
  } catch (err) {
    return { valid: false, error: 'Malformed token' };
  }
}

async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  // Parse body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  body = body || {};

  const { action, email, password, token } = body;

  // 1. Session Token Verification Action
  if (action === 'verify-token') {
    if (!token) {
      return res.status(401).json({ success: false, valid: false, error: 'Missing token' });
    }
    const result = verifyToken(token);
    if (result.valid && result.role === 'Admin') {
      return res.status(200).json({ success: true, valid: true, role: 'Admin', email: result.email });
    }
    return res.status(403).json({ success: false, valid: false, error: result.error || 'Unauthorized' });
  }

  // 2. Admin Authentication Action
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Admin Email and Master Keyphrase required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const foundAdmin = SERVER_ADMINS.find(a => a.email === cleanEmail && a.password === password);

  if (!foundAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: Account not authorized for Administrator Operations Console. Check your credentials or contact Security Operations.'
    });
  }

  // Generate trusted server session token
  const authToken = generateToken(foundAdmin.email, 'admin');

  return res.status(200).json({
    success: true,
    token: authToken,
    user: {
      name: foundAdmin.name,
      email: foundAdmin.email,
      role: 'admin'
    },
    message: 'Admin clearance verified by server.'
  });
}

// Admin-check middleware for API routes
function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : (req.headers['x-admin-token'] || (req.body && req.body.token));

  if (!token) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: false, error: 'Forbidden: Admin clearance required' }));
  }

  const verification = verifyToken(token);
  if (!verification.valid || (verification.role || '').toLowerCase() !== 'admin') {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: false, error: 'Forbidden: Admin clearance required' }));
  }

  req.adminUser = verification;
  if (typeof next === 'function') {
    next();
  }
}

handler.requireAdmin = requireAdmin;
handler.verifyToken = verifyToken;
handler.generateToken = generateToken;

module.exports = handler;
module.exports.requireAdmin = requireAdmin;
module.exports.verifyToken = verifyToken;
module.exports.generateToken = generateToken;
