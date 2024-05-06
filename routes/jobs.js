const express = require("express");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");
const jsonschema = require("jsonschema");
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/**
 * POST /jobs
 * This route creates a new job.
 * Requires admin privileges.
 */
router.post("/", ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs.join(", "));
    }

    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /jobs
 * This route lists all jobs, possibly filtered by query parameters such as title, minSalary, and hasEquity.
 */
router.get("/", async (req, res, next) => {
  try {
    const { title, minSalary, hasEquity } = req.query;
    const filterOptions = { title, minSalary, hasEquity };
    const jobs = await Job.findAll(filterOptions);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /jobs/:id
 * This route retrieves a job by ID.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/**
 * PATCH /jobs/:id
 * This route updates a job's details. ID and company_handle cannot be changed.
 * Requires admin privileges.
 */
router.patch("/:id", ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, jobUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs.join(", "));
    }

    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/**
 * DELETE /jobs/:id
 * This route deletes a job.
 * Requires admin privileges.
 */
router.delete("/:id", ensureAdmin, async (req, res, next) => {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
