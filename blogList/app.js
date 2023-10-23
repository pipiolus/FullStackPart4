const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const connectToDatabase = async () => {
  logger.info("Connecting to", config.MONGO_URI);
  await mongoose.connect(config.MONGO_URI);
  logger.info("Connected to Database");
};
connectToDatabase();

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
