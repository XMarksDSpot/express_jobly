"use strict";

const express = require("express");
const jsonschema = require("jsonschema");
const router = new express.Router();

const Company = require("../models/company");
const { ensureLoggedIn, ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");

/** POST / { company } =>  { company }
 * 
 * Creates a new company. Only accessible to logged-in administrators.
 * 
 * company should be { handle, name, description, numEmployees, logoUrl }
 * Returns { handle, name, description, numEmployees, logoUrl }
 * 
 * Authorization required: logged-in, admin
 */
router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, companyNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const company = await Company.create(req.body);
        return res.status(201).json({ company });
    } catch (err) {
        return next(err);
    }
});

/** GET / => { companies: [{ handle, name, description, numEmployees, logoUrl }, ...] }
 * 
 * Retrieves a list of companies with optional filtering.
 * Filters: minEmployees, maxEmployees, nameLike (case-insensitive, partial matches).
 * 
 * Authorization required: none
 */
router.get('/', async function (req, res, next) {
    try {
        const { name, minEmployees, maxEmployees } = req.query;
        const filters = {};

        if (minEmployees !== undefined) {
            const minEmp = parseInt(minEmployees);
            if (isNaN(minEmp)) throw new BadRequestError("minEmployees must be an integer");
            filters.minEmployees = minEmp;
        }
        if (maxEmployees !== undefined) {
            const maxEmp = parseInt(maxEmployees);
            if (isNaN(maxEmp)) throw new BadRequestError("maxEmployees must be an integer");
            filters.maxEmployees = maxEmp;
        }
        if (minEmployees !== undefined && maxEmployees !== undefined && filters.minEmployees > filters.maxEmployees) {
            throw new BadRequestError("minEmployees cannot be greater than maxEmployees.");
        }
        if (name) {
            filters.name = name;
        }

        const companies = await Company.findAll(filters);
        return res.json({ companies });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 * 
 * Updates company data. Only accessible to logged-in administrators.
 * Fields can be: { name, description, numEmployees, logoUrl }
 * Returns { handle, name, description, numEmployees, logoUrl }
 * 
 * Authorization required: logged-in, admin
 */
router.patch("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, companyUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const company = await Company.update(req.params.handle, req.body);
        return res.json({ company });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[handle] => { deleted: handle }
 * 
 * Deletes a company. Only accessible to logged-in administrators.
 * Returns { deleted: handle }
 * 
 * Authorization required: logged-in, admin
 */
router.delete("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
        await Company.remove(req.params.handle);
        return res.json({ deleted: req.params.handle });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
