const customErrorHandler = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
};

const send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Error: Forbidden Method" });
};

module.exports = { send405Error, customErrorHandler };
