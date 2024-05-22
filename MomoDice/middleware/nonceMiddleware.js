const { v4: uuidv4 } = require('uuid');

function nonceMiddleware(req, res, next) {
  const nonce = uuidv4();
  res.locals.nonce = nonce;
  console.log(`Nonce generated for request: ${nonce}`);
  next();
}

module.exports = nonceMiddleware;