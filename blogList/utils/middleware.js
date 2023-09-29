const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown Endpoint" });
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  return res.status(400).send({ error: error.message });
};

module.exports = { unknownEndpoint, errorHandler };
