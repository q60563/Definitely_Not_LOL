const JWTMiddleware = require('koa-jwt');
const JWT_CONFIG = require('../../config/jwt.json');

module.exports = JWTMiddleware({
  secret: JWT_CONFIG.secret,
  // isRevoked: isRevokedCallback
});
