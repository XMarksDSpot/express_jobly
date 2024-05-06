"use strict";

/** Shared config for application; can be required in many places. */

const dotenv = require("dotenv");
const colors = require("colors");

// Load environment variables from .env file, where API keys and passwords are configured.
dotenv.config();

// Secret key for signing JWTs, defaulting to a non-secure dev key if not set
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

// Server port number; defaults to 3001 for development and testing
const PORT = +process.env.PORT || 3001;

/**
 * Get the database URI for connecting to PostgreSQL.
 * Determines the correct database URI depending on the execution environment (test, production, etc.).
 *
 * @returns {string} - Database URI.
 */
const getDatabaseUri = () => {
  return process.env.DATABASE_URL || "postgresql://username:password@localhost/jobly";
};

// Bcrypt cost factor for hashing passwords; lower during testing for performance
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// Log configuration settings at startup for verification
console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY: process.env.SECRET_KEY || 'secret-dev',
  PORT: +process.env.PORT || 3001,
  BCRYPT_WORK_FACTOR: process.env.NODE_ENV === 'development' ? 1 : 12,
  getDatabaseUri,
};
