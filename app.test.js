const request = require("supertest");
const app = require("./app");
const db = require("./db");

describe("HTTP 404 for undefined routes", () => {
  test("returns 404 for non-existent route", async function () {
    const response = await request(app).get("/no-such-path");
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: { message: "Not Found", status: 404 }
    });
  });

  test("returns 404 and checks error structure", async function () {
    const response = await request(app).get("/no-such-path");
    expect(response.statusCode).toEqual(404);
    expect(response.body.error).toHaveProperty("message", "Not Found");
    expect(response.body.error).toHaveProperty("status", 404);
  });
});

describe("Environmental behavior", () => {
  let originalEnv;

  beforeAll(() => {
    // Save the original environment to restore after test
    originalEnv = process.env.NODE_ENV;
  });

  afterAll(() => {
    // Restore the original environment
    process.env.NODE_ENV = originalEnv;
    // Close the database connection
    db.end();
  });

  test("test stack print behavior when NODE_ENV is not set", async function () {
    process.env.NODE_ENV = ""; // Simulate non-test environment
    const response = await request(app).get("/no-such-path");
    expect(response.statusCode).toEqual(404);
    // The environment would typically control logging, but here we just check the status
  });
});

