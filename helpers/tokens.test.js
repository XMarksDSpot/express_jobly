const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe("createToken", () => {
  test("should create a token for a non-admin user", () => {
    // Setup for a non-admin user
    const token = createToken({ username: "test", isAdmin: false });
    const payload = jwt.verify(token, SECRET_KEY);

    // Assertions to check if the payload of the token is as expected
    expect(payload).toEqual({
      iat: expect.any(Number), // "iat" is the issued at time automatically set by jwt
      username: "test",
      isAdmin: false,
    });
  });

  test("should create a token for an admin user", () => {
    // Setup for an admin user
    const token = createToken({ username: "admin", isAdmin: true });
    const payload = jwt.verify(token, SECRET_KEY);

    // Assertions to check if the payload of the token matches the admin privileges
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "admin",
      isAdmin: true,
    });
  });

  test("should default to non-admin if isAdmin not provided", () => {
    // Testing default behavior when isAdmin is not explicitly set
    const token = createToken({ username: "default" });
    const payload = jwt.verify(token, SECRET_KEY);

    // Important to ensure that the default behavior correctly sets user as non-admin
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "default",
      isAdmin: false,
    });
  });

  test("should throw an error if username is missing", () => {
    // Expect an error when trying to create a token without a username
    expect(() => createToken({})).toThrow("createToken requires a user object with 'username' and 'isAdmin' properties");
  });
});
