const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const noteRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

mongoose
  .connect(config.mongoUrl)
  .then(() => {
    logger.info("Connected to Database");
  })
  .catch((error) => {
    logger.error("Problems connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());

app.use("api/blogs", noteRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
