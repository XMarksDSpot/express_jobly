const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/**
 * Generates a JWT for a given user.
 *
 * @param {Object} user - The user object must include at least `username` and `isAdmin`.
 * @returns {string} A JWT signed with the application's secret key.
 *
 * @throws {Error} If the user object does not include necessary properties.
 */
function createToken(user) {
  // Ensure the user object has the required properties
  if (typeof user !== 'object' || !user.hasOwnProperty('username') || user.isAdmin === undefined) {
    throw new Error("createToken requires a user object with 'username' and 'isAdmin' properties");
  }

  const payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  // Sign the JWT with our secret key and return it
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
