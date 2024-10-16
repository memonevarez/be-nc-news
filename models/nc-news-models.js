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
      //   if (rows.length === 0) {
      //     return Promise.reject({
      //       status: 404,
      //       msg: "The article_id provided does not exist",
      //     });
      //   }
      return rows;
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

function fetchCommentsByArticleById(article_id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      //No Promise.reject if rows.length === 0, because there can be articles wit no comments
      return rows;
    })
    .catch((err) => {
      //console.log(err);
    });
}

function addCommentByArticleById(article_id, commentData) {
  const { username, body } = commentData;
  return db
    .query(
      `INSERT INTO comments (body, article_id, author, votes, created_at)
        VALUES ($1, $2, $3, 0, NOW()) RETURNING *;`,
      [body, article_id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      //console.log(err);
      /// I had to Rethrow the error to be caught in the calling function
      throw err;
    });
}

function updateArticleByArticleId(article_id, artData, currVotes) {
  const { inc_votes } = artData;
  const updatedVotes = currVotes + inc_votes;
  return db
    .query(
      `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;`,
      [updatedVotes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      console.log(err);
      /// I had to Rethrow the error to be caught in the calling function
      throw err;
    });
}

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleById,
  addCommentByArticleById,
  updateArticleByArticleId,
};
