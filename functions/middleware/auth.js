const jwt = require("jsonwebtoken");
const { verifyJwt } = require("../utils/jwt");

// helper to read secret
const getSecret = () => process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    req.user = verifyJwt(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};

const optionalAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, getSecret());
      req.user = decoded;
    } catch {
      // ignore invalid token
    }
  }
  next();
};

module.exports = { authenticate, authorize, optionalAuth };