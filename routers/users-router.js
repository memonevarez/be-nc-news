const commentsRouter = require("express").Router();
const { getUsers } = require("../controllers/nc-news-controlers");

commentsRouter.route("/").get(getUsers);

module.exports = commentsRouter;
