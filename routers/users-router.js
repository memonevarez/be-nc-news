const commentsRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/nc-news-controlers");

commentsRouter.route("/").get(getUsers);
commentsRouter.route("/:username").get(getUserByUsername);

module.exports = commentsRouter;
