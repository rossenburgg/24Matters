const crypto = require('crypto');

function cspMiddleware(req, res, next) {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce; // Make nonce available in views

  const cspHeader = `default-src 'self'; script-src 'self' 'nonce-${nonce}'; object-src 'none'; base-uri 'self';`;

  res.setHeader('Content-Security-Policy', cspHeader);

  console.log('CSP header set with nonce:', nonce);

  next();
}

module.exports = cspMiddleware;