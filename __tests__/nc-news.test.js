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
        });
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
});
