const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleByArticleId,
} = require("./controllers/nc-news-controlers");
const endpoints = require("./endpoints.json");

app.use(express.json()); // Only when we post

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpoints });
});
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleByArticleId);

app.use((err, request, response, next) => {
  //23502:not_null_violation
  //23503: foreign_key_violation - Key (author)=(Guillermo) is not present in table "users"
  //22P02: invalid_text_representation - not-a-number cases
  if (err.code === "23502" || err.code === "22P02" || err.code === "23503") {
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
