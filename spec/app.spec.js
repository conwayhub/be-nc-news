process.env.NODE_ENV = "test";
const { app } = require("../app");
const { expect } = require("chai");
const request = require("supertest");
const connection = require("../db/connection");

describe("NC News API", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });

  describe("/api/topics", () => {
    it("GET: 200 responds with an object", () => {
      console.log("makin' requests");
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(data => {
          expect(data).to.be.an("object");
        });
    });
    it("GET :200 responds with all topics formatted as an object, with an array of objects under the key of 'topics'", () => {
      return request(app)
        .get("/api/topics")
        .then(data => {
          expect(data.body.topics).to.be.an("array");
          expect(data.body.topics.length).to.equal(3);
          expect(data.body.topics[0]).to.deep.equal({
            slug: "mitch",
            description: "The man, the Mitch, the legend"
          });
        });
    });
    it("Handles other methods with a 405 status and appropriate error message", () => {
      return request(app)
        .post("/api/topics")
        .send({
          body: {
            slug: "conway",
            description: "sittin' and typin' all day long"
          }
        })
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Error: Forbidden Method");
        });
    });
  });
  describe("/api/users", () => {
    it("GET: 200 /:username.  returns a status of 200 and an object", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
        });
    });
    it("returns correctly formatted user object", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .then(res => {
          expect(res.body.user).to.deep.equal({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          });
        });
    });
    it("GET: 404, returns 404 and an error message if username not found.", () => {
      return request(app)
        .get("/api/users/conwayhasanaccount")
        .expect(404)
        .then(data => {
          expect(data.body.msg).to.equal("content not found!");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("GET 200 and returns an article object with correct keys", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(data => {
          expect(data.body.article).to.have.all.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("GET 200 comment_count matches the number of comments sent to that article", () => {
      it("GET 200 and returns an article object with correct keys", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then(data => {
            expect(data.body.article.comment_count).to.equal(2);
          });
      });
    });
  });
});
