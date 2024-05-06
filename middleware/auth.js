"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** 
 * Middleware to authenticate user based on JWT token.
 *
 * If a token is provided, it verifies the token, and if valid, stores the
 * token payload on res.locals (includes the username and isAdmin fields).
 * It's not an error if no token was provided or if the token is not valid.
 */
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    // Note: You may decide to log invalid token attempts or ignore them
    return next();
  }
}

/** 
 * Middleware to ensure a user is logged in.
 *
 * Throws UnauthorizedError if no user is logged in.
 */
function ensureLoggedIn(req, res, next) {
  if (!res.locals.user) {
    return next(new UnauthorizedError());
  }
  next();
}

/** 
 * Middleware to ensure a user is an administrator.
 *
 * Throws UnauthorizedError if the user is not an admin.
 */
function ensureAdmin(req, res, next) {
  if (!res.locals.user || !res.locals.user.isAdmin) {
    return next(new UnauthorizedError());
  }
  next();
}

/** 
 * Middleware to ensure the user is the correct user or an admin.
 *
 * Throws UnauthorizedError if the user is neither the specified user nor an admin.
 * This checks against `req.params.username`, assuming username is the URL parameter.
 */
function ensureCorrectUserOrAdmin(req, res, next) {
  const user = res.locals.user;
  if (!(user && (user.isAdmin || user.username === req.params.username))) {
    return next(new UnauthorizedError());
  }
  next();
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
};
