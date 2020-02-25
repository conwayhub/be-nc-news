const express = require("express");
const app = express();
const { apiRouter } = require("./routers/api.router");
const { customErrorHandler } = require("./errors/index");

app.use(express.json());

app.use("/api", apiRouter);
app.use(customErrorHandler);

module.exports = { app };
