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
});
