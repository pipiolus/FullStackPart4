require("dotenv").config();

const mongoUrl = process.env.MONGO_URI;
const PORT = process.env.PORT;

module.exports = { mongoUrl, PORT };
