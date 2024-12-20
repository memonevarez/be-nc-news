const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index");
// const data = require('./data/dev-data');

beforeAll(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  db.end();
});

describe("ncNews API tests", () => {
  test("GET: 200 - /api/topics - responds with an array containing all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics).toEqual([
          { slug: "mitch", description: "The man, the Mitch, the legend" },
          { slug: "cats", description: "Not dogs" },
          { slug: "paper", description: "what books are made of" },
        ]);
      });
  });
  test("GET: 200 - /api - This endpoint will act as documentation detailing all of the available API endpoints.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpointsResponse = body.endpoints;
        expect(endpointsResponse).toEqual(endpoints);
      });
  });
  test("GET: 200 - /api/articles/:article_id - Returns all the columns of an article with the given id", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toEqual({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0,
        });
      });
  });
  test("GET: 200 - /api/articles/:article_id - Returns all the columns of an article with the given id, plus a comment_count column", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.comment_count).toBe(11);
      });
  });
  test("GET: 404 - /api/articles/:article_id - Test an article_id that doesnt exist", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("The article_id provided does not exist");
      });
  });
  test("GET: 400 - /api/articles/:article_id - Test an article_id that is not a number", () => {
    return request(app)
      .get("/api/articles/99typo")
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Bad request");
      });
  });
  test("GET: 200 - /api/articles - Returns all the articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles[0].article_id).toBe(3);
        expect(articles[0].comment_count).toBe(2);
        expect(articles).toHaveLength(13);
      });
  });
  test("GET: 200 - /api/articles - Returns all the articles sorted by votes in ASC order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles[0].votes).toBe(0);
        expect(articles[12].votes).toBe(100);
        expect(articles).toHaveLength(13);
      });
  });
  test("GET: 200 - /api/articles - Returns all the articles sorted by votes in ASC order", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=desc&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles[0].comment_count).toBe(11);
        expect(articles[0].votes).toBe(100);
        expect(articles).toHaveLength(12);
      });
  });
  test("GET: 200 - /api/articles/:article_id/comments - Returns all the comments that belong to the given article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        //2 comments, ordered by date, belonging to article 5
        expect(comments.length).toBe(2);
        expect(Date.parse(comments[0].created_at)).toBeGreaterThan(
          Date.parse(comments[1].created_at)
        );
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(5);
        });
      });
  });
  test("GET: 404 - /api/articles/:article_id/comments - Test an article_id with no comments", () => {
    return request(app)
      .get("/api/articles/12/comments")
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("Article 12 does not have comments yet");
      });
  });
  test("GET: 404 - /api/articles/:article_id/comments - Test an article_id that doesn't exist, therefore has no comments", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("The article_id provided does not exist");
      });
  });
  test("GET: 400 - /api/articles/:article_id/comments - Test an article_id that is not a number", () => {
    return request(app)
      .get("/api/articles/999BadNumber/comments")
      .expect(400)
      .then(({ body }) => {
        const comments = body.msg;
        expect(comments).toBe("Bad request");
      });
  });
  test("POST: 201 - /api/articles/:article_id/comments - Post a new comment to the given article_id", () => {
    const newComment = {
      username: "lurker",
      body: "We might all sue that man for leaving us",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment.comment_id).toBe(19);
        expect(comment.author).toBe("lurker");
        expect(comment.body).toBe("We might all sue that man for leaving us");
      });
  });
  test("POST: 404 - /api/articles/:article_id/comments - try to Post a new comment to a article_id that does not exist", () => {
    const newComment = {
      username: "lurker",
      body: "We might all sue that man for leaving us",
    };
    return request(app)
      .post("/api/articles/99/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const comment = body.msg;
        expect(comment).toBe("The article_id provided does not exist");
      });
  });
  test("POST: 400 - /api/articles/:article_id/comments - try to Post a new comment with a username that does not exist", () => {
    const newComment = {
      username: "Guillermo",
      body: "The table comments references users(username) ugghhhh, so SQL will not like it",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const comment = body.msg;
        expect(comment).toBe("Bad request");
      });
  });
  test("PATCH: 200 - /api/articles/:article_id - update the number of votes of an article with the given articule_id", () => {
    const votesUpdate = { inc_votes: 89 };
    return request(app)
      .patch("/api/articles/12")
      .send(votesUpdate)
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body.updatedArticle;
        expect(updatedArticle).toEqual({
          article_id: 12,
          title: "Moustache",
          topic: "mitch",
          author: "butter_bridge",
          body: "Have you seen the size of that thing?",
          created_at: "2020-10-11T11:24:00.000Z",
          votes: 89,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH: 404 - /api/articles/:article_id - try to update the number of votes but the given articule_id does not exist", () => {
    const votesUpdate = { inc_votes: 89 };
    return request(app)
      .patch("/api/articles/777")
      .send(votesUpdate)
      .expect(404)
      .then(({ body }) => {
        const updatedArticle = body.msg;
        expect(updatedArticle).toBe("The article_id provided does not exist");
      });
  });
  test("PATCH: 404 - /api/articles/:article_id - try to update the number of votes but the given articule_id is not-a-number", () => {
    const votesUpdate = { inc_votes: 89 };
    return request(app)
      .patch("/api/articles/not-a-number")
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        const updatedArticle = body.msg;
        expect(updatedArticle).toBe("Bad request");
      });
  });
  test("PATCH: 404 - /api/articles/:article_id - try to update the number of votes but the votes in the given object are not-a-number", () => {
    const votesUpdate = { inc_votes: "bad-number" };
    return request(app)
      .patch("/api/articles/9")
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        const updatedArticle = body.msg;
        expect(updatedArticle).toBe("Not a valid number of votes");
      });
  });
  test("DELETE: 204 - /api/comments/:comment_id - Delete a comment with the given comment_id", () => {
    return request(app)
      .delete("/api/comments/16")
      .expect(204)
      .then(() => {
        // Nothing was sent, so I check the GET endpoint and expect 404-NotFound
        return request(app).get("/api/comments/16").expect(404);
      });
  });
  test("DELETE: 404 - /api/comments/:comment_id - try to Delete a comment, but comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/888")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment with id 888 does not exist.");
      });
  });
  test("DELETE: 400 - /api/comments/:comment_id - try to Delete a comment, with an invalid comment_id ", () => {
    return request(app)
      .delete("/api/comments/not-a-numberrr")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET: 200 - /api/users - responds with an array containing all the users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(Object.keys(user).toSorted()).toEqual([
            "avatar_url",
            "name",
            "username",
          ]);
        });
      });
  });
  test("GET: 200 - /api/users/:username - responds with an object containing the user with the given username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("GET: 200 - /api/users/:username - Try to get an user with an username that does nnot exist", () => {
    return request(app)
      .get("/api/users/Guillermo")
      .expect(404)
      .then(({ body }) => {
        const user = body.msg;
        expect(user).toBe("The username Guillermo provided does not exist");
      });
  });
  test("PATCH: 200 - /api/comments/:comment_id - update the number of votes of a comment with the given comment_id", () => {
    const votesUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/14")
      .send(votesUpdate)
      .expect(200)
      .then(({ body }) => {
        const updatedComment = body.updatedComment;
        expect(updatedComment.votes).toBe(17);
        expect(updatedComment.comment_id).toBe(14);
      });
  });
  test("PATCH: 404 - /api/comments/:comment_id - try to update the number of votes but the given articule_id does not exist", () => {
    const votesUpdate = { inc_votes: 89 };
    return request(app)
      .patch("/api/comments/777")
      .send(votesUpdate)
      .expect(404)
      .then(({ body }) => {
        const updatedCommnet = body.msg;
        expect(updatedCommnet).toBe("Comment with id 777 does not exist.");
      });
  });
  test("PATCH: 404 - /api/comments/:comment_id - try to update the number of votes but the given articule_id is not-a-number", () => {
    const votesUpdate = { inc_votes: 89 };
    return request(app)
      .patch("/api/comments/not-a-number")
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        const updatedCommnet = body.msg;
        expect(updatedCommnet).toBe("Bad request");
      });
  });
  test("PATCH: 404 - /api/comments/:comment_id - try to update the number of votes but the votes in the given object are not-a-number", () => {
    const votesUpdate = { inc_votes: "bad-number" };
    return request(app)
      .patch("/api/comments/9")
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        const updatedCommnet = body.msg;
        expect(updatedCommnet).toBe("Not a valid number of votes");
      });
  });
});
