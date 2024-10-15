const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
}

function fetchArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "The article_id provided does not exist",
        });
      }
      return rows[0];
    });
}

function fetchArticles() {
  return db
    .query(
      `select articles.author, title, articles.article_id, topic, articles.created_at, articles.votes,
    article_img_url, CAST(count(comments.body) AS INT) AS comment_count from articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes,
    article_img_url order by articles.created_at DESC;`
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "There are no articles yet",
        });
      }
      return rows;
    });
}

module.exports = { fetchTopics, fetchArticleById, fetchArticles };
