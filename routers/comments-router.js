const commentsRouter = require("express").Router();
const {
  getCommentById,
  deleteComment,
  patchCommentVotesByCommentId,
} = require("../controllers/nc-news-controlers");

commentsRouter
  .route("/:comment_id")
  .get(getCommentById)
  .delete(deleteComment)
  .patch(patchCommentVotesByCommentId);

module.exports = commentsRouter;
