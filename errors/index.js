const customErrorHandler = (err, req, res, next) => {
  if (err.hasOwnProperty("status")) {
    const messages = { 404: "content not found" };

    res.status(err.status).send({ msg: messages[err.status] });
  } else {
    next(err);
  }
};

const psqlErrorHandler = (err, req, res, next) => {
  let errCode = err.code;
  const errors = { "22P02": { status: 400, msg: "Bad data type" } };
  res.status(errors[errCode].status).send({ msg: errors[errCode].msg });
};

const send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Error: Forbidden Method" });
};

module.exports = { send405Error, customErrorHandler, psqlErrorHandler };