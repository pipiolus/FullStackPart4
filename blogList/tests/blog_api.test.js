const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  let blog = new Blog(helper.initialBlogs[0]);
  await blog.save();
  blog = new Blog(helper.initialBlogs[1]);
  await blog.save();
}, 100000);

test("blogs are returned as JSON", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test.only("unique identifier property is named 'ID'", async () => {
  const blogToView = helper.initialBlogs[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(resultBlog.body.id).toBeDefined();
  /* expect(resultBlog.body).toEqual(blogToView.body); */
}, 100000);

afterAll(async () => {
  await mongoose.connection.close();
});
