"use strict";

/** Express app setup for Jobly. */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Error handling utilities
const { NotFoundError } = require("./expressError");

// Authentication middleware
const { authenticateJWT } = require("./middleware/auth");

// Route modules
const authRoutes = require("./routes/auth");
const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");

const app = express();

// Apply middleware
app.use(cors()); // Enables CORS
app.use(express.json()); // Parses incoming JSON requests and puts the parsed data in req.body
app.use(morgan("tiny")); // Logger for HTTP requests
app.use(authenticateJWT); // Middleware to check for JWT token in the Authorization headers

// Route handlers
app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/users", usersRoutes);

/** 
 * Handle 404 errors -- this matches everything that hasn't been matched by previous routes
 */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** 
 * Generic error handler; any unhandled errors go here.
 * Filters out error handling during tests to avoid polluting test outputs.
 */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") {
    console.error(err.stack);
  }
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
