const { fetchTopics } = require("../models/nc-news-models");

function getTopics(request, response) {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      response.status(400).send({ msg: "No topics found" });
    });
}

module.exports = { getTopics };
