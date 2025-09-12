const jwt = require("jsonwebtoken");
const { defineSecret } = require("firebase-functions/params");

const JWT_SECRET = defineSecret("JWT_SECRET");

function getSecret() {
  return (JWT_SECRET.value && JWT_SECRET.value()) || process.env.JWT_SECRET;
}

function signJwt(payload, options = {}) {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d", ...options });
}

function verifyJwt(token) {
  return jwt.verify(token, getSecret());
}

module.exports = { signJwt, verifyJwt, getSecret };
