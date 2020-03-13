const customErrorHandler = (err, req, res, next) => {
  if (err.hasOwnProperty("status")) {
    const messages = { 404: "content not found", 400: "Bad data type" };

    res.status(err.status).send({ msg: messages[err.status] });
  } else {
    next(err);
  }
};

const psqlErrorHandler = (err, req, res, next) => {
  if (err.hasOwnProperty("status")) {
    let errCode = err.code;
    const errors = {
      "22P02": { status: 400, msg: "Bad data type" },
      "23503": { status: 404, msg: "Foreign key" }
    };
    res.status(errors[errCode].status).send({ msg: errors[errCode].msg });
  } else {
    next(err);
  }
};

const send500Error = (err, req, res, next) => {
  res.status(500).send({ msg: "Sorry, it's an internal server error" });
};

const send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Error: Forbidden Method" });
};

module.exports = {
  send405Error,
  customErrorHandler,
  psqlErrorHandler,
  send500Error
};
