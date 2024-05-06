"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  userToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */

describe("POST /users", function () {
  const newUser = {
    username: "newuser",
    firstName: "Test",
    lastName: "User",
    password: "password",
    email: "testuser@test.com",
    isAdmin: false,
  };

  test("works for admins", async function () {
    const resp = await request(app)
        .post("/users")
        .send(newUser)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "newuser",
        firstName: "Test",
        lastName: "User",
        email: "testuser@test.com",
        isAdmin: false,
      },
      token: expect.any(String),
    });
  });

  test("unauth for non-admins", async function () {
    const resp = await request(app)
        .post("/users")
        .send(newUser)
        .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toEqual(403);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "newuser",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          ...newUser,
          email: "not-an-email",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users */

describe("GET /users", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      users: [
        {username: "u1", firstName: "U1F", lastName: "U1L", email: "user1@user.com", isAdmin: false},
        {username: "u2", firstName: "U2F", lastName: "U2L", email: "user2@user.com", isAdmin: false},
        // Add expected users here
      ],
    });
  });

  test("unauth for non-admins", async function () {
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toEqual(403);
  });
});

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works for correct user", async function () {
    const resp = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${userToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
  });

  test("unauth for wrong user", async function () {
    const resp = await request(app)
        .get(`/users/u2`)
        .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toEqual(403);
  });

  test("not found for no such user", async function () {
    const resp = await request(app)
        .get(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", function () {
  test("works for correct user", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({firstName: "NewFirst"})
        .set("authorization", `Bearer ${userToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "NewFirst",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
  });

  test("unauth for wrong user", async function () {
    const resp = await request(app)
        .patch(`/users/u2`)
        .send({firstName: "NewFirst"})
        .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toEqual(403);
  });

  test("not found for no such user", async function () {
    const resp = await request(app)
        .patch(`/users/nope`)
        .send({firstName: "Nope"})
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({email: "not-an-email"})
        .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  test("works for correct user", async function () {
    const resp = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${userToken}`);
    expect(resp.body).toEqual({ deleted: "u1" });
  });

  test("unauth for wrong user", async function () {
    const resp = await request(app)
        .delete(`/users/u2`)
        .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toEqual(403);
  });

  test("not found for no such user", async function () {
    const resp = await request(app)
        .delete(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
