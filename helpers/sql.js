/**
 * Helper functions for building SQL queries.
 */

/**
 * Generates SQL for partial update of a row.
 *
 * @param {Object} dataToUpdate - Fields to be updated.
 * @param {Object} jsToSql - Maps JavaScript field names to database column names.
 * @returns {Object} - Object containing a SQL query string and array of values.
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  // Get keys and initialize variables for SQL query
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new Error("No data");

  // Map the keys to column names and format for SQL set clause
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  // Build SQL query string
  let query = `SET ${cols.join(", ")}`;
  let values = Object.values(dataToUpdate);

  return { query, values };
}

/**
 * Helper function to create a SELECT query with filters.
 *
 * @param {Object} filters - Object containing filter parameters.
 * @returns {String} - SQL query string.
 */
function createSelectQuery(filters) {
  let baseQuery = "SELECT * FROM tablename WHERE 1=1";
  let filterClauses = [];
  let values = [];

  if (filters.minDate) {
    values.push(filters.minDate);
    filterClauses.push(`date >= $${values.length}`);
  }
  if (filters.maxDate) {
    values.push(filters.maxDate);
    filterClauses.push(`date <= $${values.length}`);
  }
  if (filters.keyword) {
    values.push(`%${filters.keyword}%`);
    filterClauses.push(`description LIKE $${values.length}`);
  }

  // Add filters to the base query
  if (filterClauses.length > 0) {
    baseQuery += " AND " + filterClauses.join(" AND ");
  }

  return {
    query: baseQuery,
    values
  };
}

module.exports = { sqlForPartialUpdate, createSelectQuery };
