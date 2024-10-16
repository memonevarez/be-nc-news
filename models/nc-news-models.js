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
      if (!rows[0]) {
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
      if (!rows[0]) {
        //rows.length === 0
        //Better than silently returning undefined
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
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `Article ${article_id} does not have comments yet`,
        });
      }
      return rows;
    })
    .catch((err) => {
      //console.log(err);
      throw err;
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
    });
}

function fetchCommentById(comment_id) {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `Comment with id ${comment_id} does not exist.`,
        });
      }
      return rows[0]; // return the (1)comment found
    });
}

function removeComment(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      //if no comment was deleted returns [], rows[0] would be undefined, so:
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `Comment with id ${comment_id} does not exist.`,
        });
      }
      return rows[0];
    });
}

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleById,
  addCommentByArticleById,
  updateArticleByArticleId,
  removeComment,
  fetchCommentById,
};
