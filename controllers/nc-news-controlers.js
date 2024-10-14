const { fetchTopics, fetchArticleById } = require("../models/nc-news-models");

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
      //console.log(err, "In the controller");
      next(err);
    });
}

module.exports = { getTopics, getArticleById };
