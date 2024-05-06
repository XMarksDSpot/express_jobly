"use strict";

/**
 * Database setup for Jobly.
 * This module configures and establishes a connection to the database using the PostgreSQL client from the `pg` package.
 * It uses different settings based on whether the environment is production or development/testing.
 */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

// Declare the database client variable
let db;

// Configure database connection settings based on environment
if (process.env.NODE_ENV === "production") {
  // For production, connect to the database using SSL encryption
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false  // Necessary for Heroku and other cloud providers that use self-signed certificates
    }
  });
} else {
  // For development and testing, connect without SSL
  db = new Client({
    connectionString: getDatabaseUri()
  });
}

// Connect to the database
db.connect()
  .catch(e => {
    console.error(`Failed to connect to the database: ${e}`);
    process.exit(1);  // Exit the application with an error code
  });

// Export the database client for use elsewhere in the application
module.exports = db;
