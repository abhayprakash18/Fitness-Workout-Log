const jwt = require('jsonwebtoken');

/**
 * Generate JWT token signed with JWT_SECRET
 * @param {string} id - User ID to embed in payload
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
