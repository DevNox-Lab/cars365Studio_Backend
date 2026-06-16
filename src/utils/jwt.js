const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token
 * @param {Object} payload - Token payload (e.g. { id, role })
 * @returns {string}
 */
const generateToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { generateToken };
