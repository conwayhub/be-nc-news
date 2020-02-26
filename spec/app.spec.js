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
          expect(data.body.msg).to.equal("content not found");
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
    it("GET 400 and a valid error message when passed an invalid data type as an article id", () => {
      return request(app)
        .get("/api/articles/conways_boss_article")
        .expect(400)
        .then(data => {
          expect(data.body.msg).to.equal("Bad data type");
        });
    });
    it("GET 404 and a valid error message when passed an article number that doesn't exist", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(data => {
          expect(data.body.msg).to.equal("content not found");
        });
    });
    it("PATCH 200 and returns an article object when passed a body with an inc_votes key", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(data => {
          expect(data.body.article.votes).to.equal(101);
        });
    });
    it("PATCH 200 when passed a negative number, decreases the votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(data => {
          expect(data.body.article.votes).to.equal(90);
        });
    });
    it("PATCH 400 and an appropriate error message when passed a bad data type", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "ten" })
        .expect(400)
        .then(data => {
          expect(data.body.msg).to.equal("Bad data type");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("POST 201, returns 201 and a comment posted to the correct article", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
          body: "I recognize psql as a bold warrior mouse, squeak squeak!"
        })
        .expect(201)
        .then(data => {
          expect(data.body.comment).to.have.all.keys(
            "body",
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at"
          );
          expect(data.body.comment.article_id).to.equal(1);
          expect(data.body.comment.author).to.equal("rogersop");
        });
    });
    it("GET 200 returns an array of comments if given an article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(data => {
          expect(data.body.comments).to.be.an("array");
          expect(data.body.comments[0]).to.have.all.keys(
            "body",
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at"
          );
        });
    });
    it("Should return all comments posted to the article_id given", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .then(data => {
          expect(data.body.comments.length).to.equal(13);
        });
    });
    // it("Should accept the sort_by query, and sort comments by any valid column (defaulting to created_at)", () => {
    //   return request(app)
    //     .get("/api/articles/1/comments?sort_by=votes")
    //     .then(data => {
    //       const votes = [];
    //       data.body.comments.forEach(element => {
    //         const votes = sorted.push(element.votes);
    //       });
    //       const sorted = votes.sort();
    //       console.log(sorted);
    //     });
    // });
  });
});
