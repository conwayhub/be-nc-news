const express = require("express");
const app = express();
const { apiRouter } = require("./routers/api.router");
const cors = require("cors");
const {
  customErrorHandler,
  psqlErrorHandler,
  send500Error
} = require("./errors/index");

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);
app.use(customErrorHandler);
app.use(psqlErrorHandler);
app.use(send500Error);

module.exports = { app };
