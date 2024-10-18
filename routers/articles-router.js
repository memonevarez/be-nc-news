const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleByArticleId,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/nc-news-controlers");

articlesRouter.route("/").get(getArticles);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleByArticleId);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
