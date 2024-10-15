const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/nc-news-controlers");
const endpoints = require("./endpoints.json");

// app.use(express.json()); // Only when we post

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpoints });
});
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

// Handle 404 errors
// app.use((req, res, next) => {
//   res.status(404).send({ error: "Route not found" });
// });
app.use((err, request, response, next) => {
  if (err.code === "23502" || err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  }
  next(err);
});

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

// General error handler for unexpected errors
app.use((err, request, response, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
