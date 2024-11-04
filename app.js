const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const cors = require("cors");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./error-handlers/error-handlers");

app.use(cors());
app.use(express.json()); // Only when we post
app.use("/api", apiRouter);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
