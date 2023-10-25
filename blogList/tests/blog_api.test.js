const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
}, 100000);

describe("When making GET requests to endpoint", () => {
  test("blogs are returned as JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("unique identifier property is named 'id'", async () => {
    const request = await api.get("/api/blogs");
    const blogsInDB = request.body.map((blog) => blog);
    const blogToView = blogsInDB[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultBlog.body.id).toBeDefined();
    expect(resultBlog.body).toEqual(blogToView);
  }, 100000);
});

describe("When making POST requests to endpoint", () => {
  test("if no token is provided will result in 'status 401 Unauthorized'", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      title: "Understanding the npm dependency model",
      author: "Alexis king",
      url: "https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401);

    expect(response.body).toEqual({
      error: "jwt must be provided",
    });

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toEqual(blogsAtStart);
  }, 100000);

  test("if 'likes' property is missing, it will default to zero", async () => {
    const validUserForLogin = {
      username: "pendragon",
      password: "secret",
    };

    const response = await api
      .post("/api/login")
      .send(validUserForLogin);

    const token = response.body.token;

    const newBlog = {
      title: "Understanding the npm dependency model",
      author: "Alexis king",
      url: "https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .auth(token, { type: "bearer" })
      .expect(201)
      .expect("Content-type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find(
      (blog) => blog.author === "Alexis king"
    );
    expect(addedBlog.likes).toBe(0);
  }, 100000);

  test("adding a valid blog is successful", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const validUserForLogin = {
      username: "pendragon",
      password: "secret",
    };

    const response = await api
      .post("/api/login")
      .send(validUserForLogin);

    const token = response.body.token;

    const newBlog = {
      title: "Understanding the npm dependency model",
      author: "Alexis king",
      url: "https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/",
      likes: 9,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .auth(token, { type: "bearer" })
      .expect(201)
      .expect("Content-type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const authors = blogsAtEnd.map((blog) => blog.author);

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
    expect(authors).toContain("Alexis king");
  }, 100000);

  test("with invalid data results in statuscode 400 'bad request'", async () => {
    const validUserForLogin = {
      username: "pendragon",
      password: "secret",
    };

    const response = await api
      .post("/api/login")
      .send(validUserForLogin);

    const token = response.body.token;

    const newBlog = {
      author: "Alexis king",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .auth(token, { type: "bearer" })
      .expect(400);
  }, 100000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
