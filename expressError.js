"use strict";

/**
 * Base class for all custom express errors.
 * ExpressError extends the normal JS error to include a status code, which can be used
 * to facilitate error handling in Express middleware.
 */
class ExpressError extends Error {
  constructor(message, status) {
    super(message);  // Call the parent class constructor with the message.
    this.status = status;  // Specific HTTP status code appropriate for this error.
  }
}

/**
 * NotFoundError for handling 404 errors.
 */
class NotFoundError extends ExpressError {
  constructor(message = "Not Found") {
    super(message, 404);  // Pass the default message and status code to the parent constructor.
  }
}

/**
 * UnauthorizedError for handling 401 errors.
 */
class UnauthorizedError extends ExpressError {
  constructor(message = "Unauthorized") {
    super(message, 401);  // Pass the default message and status code to the parent constructor.
  }
}

/**
 * BadRequestError for handling 400 errors.
 */
class BadRequestError extends ExpressError {
  constructor(message = "Bad Request") {
    super(message, 400);  // Pass the default message and status code to the parent constructor.
  }
}

/**
 * ForbiddenError for handling 403 errors.
 */
class ForbiddenError extends ExpressError {
  constructor(message = "Forbidden") {
    super(message, 403);  // Pass the default message and status code to the parent constructor.
  }
}

// Exporting all custom error classes for use elsewhere in the application.
module.exports = {
  ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
};
