const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = await User.findById(request.user.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  });

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).end();
  }
  const savedBlog = await blog.save();
  await savedBlog.populate("user", { username: 1 });
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogRouter.post("/:id/comments", async (request, response) => {
  const body = request.body;

  try {
    const blogId = request.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      response.status(404).json({ error: "Blog not found" });
    }

    if (!blog.comments) {
      blog.comments = [];
    }

    const { text } = body;
    blog.comments.push({ text });

    const updatedBlog = await blog.save();
    response.status(201).json(updatedBlog);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

blogRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    {
      new: true,
    }
  ).populate("user", { username: 1 });

  response.status(200).json(updatedBlog);
});

blogRouter.delete(
  "/:id",
  userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    const user = request.user;

    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(blog.id);
      response.status(204).end();
    } else {
      return response.status(401).json({
        error: "invalid user for operation",
      });
    }
  }
);

module.exports = blogRouter;
