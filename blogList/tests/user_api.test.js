const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUsers);
}, 100000);

describe("When creating a new user", () => {
  test("A valid user can be added", async () => {
    const newUser = {
      username: "Testing",
      name: "AnyName",
      password: "123456",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);
  }, 100000);

  test("Invalid username results in proper status and message", async () => {
    const newInvalidUser = {
      username: "U",
      name: "BadNameTooShort",
      password: "123456",
    };

    const result = await api
      .post("/api/users")
      .send(newInvalidUser)
      .expect(400);

    expect(result.body.error).toContain(
      "username or password length shorter than minimum"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length);
  }, 100000);

  test("Invalid password results in proper status and message", async () => {
    const newInvalidUser = {
      username: "ThisIsFine",
      name: "PasswordTooShort",
      password: "12",
    };

    const result = await api
      .post("/api/users")
      .send(newInvalidUser)
      .expect(400);

    expect(result.body.error).toContain(
      "username or password length shorter than minimum"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length);
  }, 100000);

  test("Username already taken results in error and creation fails", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Pipiolus",
      name: "Giova",
      password: "admin123",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "expected `username` to be unique"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  }, 100000);
});

afterAll(async () => {
  await mongoose.connection.close();
}, 100000);
