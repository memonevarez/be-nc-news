const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/nc-news-controlers");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
