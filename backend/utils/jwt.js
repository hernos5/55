const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Generate access token for user
const generateAccessToken = (user) => {
  return generateToken({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  });
};

module.exports = {
  generateToken,
  verifyToken,
  generateAccessToken
};

