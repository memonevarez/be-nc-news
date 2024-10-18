const commentsRouter = require("express").Router();
const {
  getCommentById,
  deleteComment,
} = require("../controllers/nc-news-controlers");

commentsRouter.route("/:comment_id").get(getCommentById).delete(deleteComment);

module.exports = commentsRouter;
