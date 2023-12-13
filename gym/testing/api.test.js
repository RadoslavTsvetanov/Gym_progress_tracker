const axios = require("axios");

describe("Authentication Microservice", () => {
  describe("POST /auth/signup", () => {
    test("Create user successfully", async () => {
      const userData = { username: "newUser", password: "password123" };
      const response = await axios.post(
        "http://localhost:3000/auth/signup",
        userData
      );

      expect(response.status).toBe(201);
      expect(response.data).toEqual({ message: "User created successfully" });
    });

    test("Attempt to create an existing user", async () => {
      const existingUserData = {
        username: "existingUser",
        password: "password123",
      };
      try {
        await axios.post("http://localhost:3000/auth/signup", existingUserData);
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toEqual({ error: "User already exists" });
      }
    });
  });
});
