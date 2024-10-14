const express = require("express");
const app = express();
const { getTopics } = require("./controllers/nc-news-controlers");
const endpoints = require("./endpoints.json");

// app.use(express.json()); // Only when we post

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpoints });
});
app.get("/api/topics", getTopics);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send({ error: "Route not found" });
});

// General error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Internal server error" });
});

module.exports = app;
