const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleById,
  addCommentByArticleById,
  updateArticleByArticleId,
  removeComment,
  fetchCommentById,
  fetchUsers,
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
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(request, response, next) {
  const { sort_by, order } = request.query;
  fetchArticles(sort_by, order)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}
/**
   Promise.all([
     fetchCommentsByArticleById(article_id),
    fetchArticleById(article_id),
  ])
 * The problem with this is that Promise.all starts everything at the same time but
  when the it gets the first Reject it jumps to the catch
  My messages are slightly different:
  -The article_id provided does not exist
  -Article 999 does not have comments yet
  And sometimes one finishes first than the other
  THEREFORE, these should be chained, not in a Promise.all
 */

function getCommentsByArticleId(request, response, next) {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      return fetchCommentsByArticleById(article_id);
    })
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postCommentByArticleId(request, response, next) {
  const { article_id } = request.params;
  const commentData = request.body;
  fetchArticleById(article_id)
    .then(() => {
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
      return updateArticleByArticleId(article_id, artData, article.votes);
    })
    .then((updatedArticle) => {
      response.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
}

function getCommentById(request, response, next) {
  const { comment_id } = request.params;
  fetchCommentById(comment_id)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch(next);
}

function deleteComment(request, response, next) {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then((comment) => {
      response.status(204).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

function getUsers(request, response, next) {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
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
  deleteComment,
  getCommentById,
  getUsers,
};
