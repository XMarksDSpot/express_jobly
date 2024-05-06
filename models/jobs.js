const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Job {
  static async create({ title, salary, equity, company_handle }) {
    const result = await db.query(
      `INSERT INTO jobs (title, salary, equity, company_handle)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, salary, equity, company_handle`,
      [title, salary, equity, company_handle]
    );
    const job = result.rows[0];
    return job;
  }

  static async findAll({ minSalary, hasEquity, title } = {}) {
    let query = `SELECT id, title, salary, equity, company_handle FROM jobs`;
    let whereParts = [];
    let queryValues = [];

    if (minSalary !== undefined) {
      queryValues.push(minSalary);
      whereParts.push(`salary >= $${queryValues.length}`);
    }
    if (hasEquity) {
      whereParts.push(`equity > 0`);
    }
    if (title) {
      queryValues.push(`%${title}%`);
      whereParts.push(`title ILIKE $${queryValues.length}`);
    }

    if (whereParts.length > 0) {
      query += " WHERE " + whereParts.join(" AND ");
    }

    query += " ORDER BY title";
    const jobsRes = await db.query(query, queryValues);
    return jobsRes.rows;
  }

  static async get(id) {
    const jobRes = await db.query(
      `SELECT id, title, salary, equity, company_handle
       FROM jobs
       WHERE id = $1`, [id]);
    const job = jobRes.rows[0];
    if (!job) throw new NotFoundError(`No job: ${id}`);
    return job;
  }

  static async update(id, data) {
    const { query, values } = sqlForPartialUpdate(data, {});
    const jobRes = await db.query(
      `UPDATE jobs SET ${query} 
       WHERE id = $${values.length + 1} 
       RETURNING id, title, salary, equity, company_handle`,
      [...values, id]);
    const job = jobRes.rows[0];
    if (!job) throw new NotFoundError(`No job: ${id}`);
    return job;
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM jobs WHERE id = $1 RETURNING id`, [id]);
    const job = result.rows[0];
    if (!job) throw new NotFoundError(`No job: ${id}`);
  }
}

module.exports = Job;
