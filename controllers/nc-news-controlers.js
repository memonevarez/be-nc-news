const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleById,
  addCommentByArticleById,
  updateArticleByArticleId,
} = require("../models/nc-news-models");

function getTopics(request, response) {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      response.status(400).send({ msg: "No topics found" });
    });
}

function getArticleById(request, response, next) {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      if (article.length === 0) {
        response.status(404).send({
          msg: `The article_id provided does not exist`,
        });
      } else {
        response.status(200).send({ article: article[0] });
      }
    })
    .catch((err) => {
      //console.log(err, "In the controller");
      next(err);
    });
}

function getArticles(request, response, next) {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsByArticleId(request, response, next) {
  const { article_id } = request.params;
  Promise.all([
    fetchCommentsByArticleById(article_id),
    fetchArticleById(article_id),
  ])
    .then((result) => {
      if (result[0].length === 0) {
        response.status(404).send({
          comments: `Article ${article_id} does not have comments yet`,
        });
      } else {
        response.status(200).send({ comments: result[0] });
      }
    })
    .catch((err) => {
      next(err);
    });
}

function postCommentByArticleId(request, response, next) {
  const { article_id } = request.params;
  const commentData = request.body;
  fetchArticleById(article_id)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `The article_id provided does not exist`,
        });
      }
      return addCommentByArticleById(article_id, commentData);
    })
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
}

function patchArticleByArticleId(request, response, next) {
  const { article_id } = request.params;
  const artData = request.body;
  fetchArticleById(article_id)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `The article_id provided does not exist`,
        });
      }
      return updateArticleByArticleId(article_id, artData, article[0].votes);
    })
    .then((updatedArticle) => {
      response.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
}

module.exports = {
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleByArticleId,
};
