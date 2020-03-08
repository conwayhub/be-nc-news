process.env.NODE_ENV = "test";
const { app } = require("../app");
const { expect } = require("chai");
const chaiSorted = require("sams-chai-sorted");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
chai.use(chaiSorted);
const { isItReal } = require("../models/articles.models");

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
    it("POST 404, returns 400 and an appropriate error message when passed an invalid username", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "conway",
          body:
            "I don't see what's so great about being on a database anyway..."
        })
        .expect(404)
        .then(data => {
          expect(data.body.msg).to.equal("Foreign key");
        });
    });
    it("POST 400 when passed an invalid data type, returns an appropriate error message", () => {
      return request(app)
        .post("/api/articles/not-a-valid-article/comments")
        .send({
          username: "rogersop",
          body: "I recognize psql as a bold warrior mouse, squeak squeak!"
        })
        .expect(400)
        .then(data => {
          expect(data.body.msg).to.equal("Bad data type");
        });
    });
    it("POST 404 when passed a comment for an article that doesn't exist", () => {
      return request(app)
        .post("/api/articles/9999/comments")
        .send({
          username: "rogersop",
          body: "I recognize psql as a bold warrior mouse, squeak squeak!"
        })
        .expect(404)
        .then(data => {
          expect(data.body.msg).to.equal("Foreign key");
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
    it("By default, sorts by created_at, and descending)", () => {
      return request(app)
        .get("/api/articles/1/comments?")
        .expect(200)
        .then(data => {
          expect(data.body.comments).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("when passed a sort_by query, sorts by that value, descending", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes")
        .then(data => {
          expect(data.body.comments).to.be.sortedBy("votes", {
            descending: true
          });
        });
    });
    it("when passed the order=ascending query, sorts in ascending order", () => {
      return request(app)
        .get("/api/articles/1/comments?order=asc")
        .then(data => {
          expect(data.body.comments).to.be.sortedBy("created_at");
        });
    });
    it("allows you to chain multiple queries", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes&order=asc")
        .then(data => {
          expect(data.body.comments).to.be.sortedBy("votes");
        });
    });
    it("GET 400 returns an appropriate error message if passed an invalid sort_by query", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=not-a-column")
        .expect(400)
        .then(data => {
          expect(data.body.msg).to.equal("Bad data type");
        });
    });
    it("GET 404 if passed an invalid article ID", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(data => {
          expect(data.body.msg).to.equal("content not found");
        });
    });
    it("GET 200 response with an empty array when passed an article with no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(data => {
          expect(data.body.comments.length).to.equal(0);
        });
    });
    it("GET 400 and an appropriate error message if passed an invalid data type into it's article ID", () => {
      return request(app)
        .get("/api/articles/conways_article/comments")
        .expect(400)
        .then(data => {
          expect(data.body.msg).to.equal("Bad data type");
        });
    });
  });
  describe("/api/articles", () => {
    it("GET 200 returns an array of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(data => {
          expect(data.body.articles).to.be.an("array");
          expect(data.body.articles[0]).to.have.all.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(data.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("accepts sort_by and order queries and sorts the array accordingly", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .then(data => {
          expect(data.body.articles).to.be.sortedBy("title");
        });
    });
    it("GET 400 and returns an appropriate error message when passed an invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=not-a-valid-column")
        .expect(400)
        .then(data => {
          expect(data.body.msg).to.equal("Bad data type");
        });
    });
    it("accepts an author query, and filters the articles by author", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .then(data => {
          data.body.articles.forEach(article => {
            expect(article.author).to.equal("icellusedkars");
          });
          expect(data.body.articles.length).to.equal(6);
        });
    });
    it("accepts a topic query, and filters the articles by topics", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .then(data => {
          data.body.articles.forEach(article => {
            expect(article.topic).to.equal("mitch");
          });
          expect(data.body.articles.length).to.equal(11);
        });
    });
    it("accepts chained queries", () => {
      return request(app)
        .get("/api/articles?topic=mitch&author=butter_bridge")
        .then(data => {
          expect(data.body.articles.length).to.equal(3);
          data.body.articles.forEach(article => {
            expect(article.topic).to.equal("mitch");
            expect(article.author).to.equal("butter_bridge");
          });
        });
    });
    it("GET 200 if passed a user with no articles responds with an empty array", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(data => {
          expect(data.body.articles).to.deep.equal([]);
        });
    });
    it("GET 404 if passed a user who doesn't exist", () => {
      return request(app)
        .get("/api/articles?author=littlejimmynotreal")
        .expect(404)
        .then(data => {
          expect(data.body.msg).to.equal("content not found");
        });
    });
    it("GET 404 if passed a topic that doesn't exist", () => {
      return request(app)
        .get("/api/articles?topic=conwayisthetopic")
        .expect(404)
        .then(data => {
          expect(data.body.msg).to.equal("content not found");
        });
    });
    it("GET 200 if passed a user who does exist but has no comments", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(data => {
          expect(data.body.articles).to.deep.equal([]);
        });
    });
    it("PATCH 405 if forbidden method is attempted returns a 405 status and an appropriate message!", () => {
      return request(app)
        .patch("/api/articles")
        .expect(405)
        .then(data => {
          expect(data.body.msg).to.equal("Error: Forbidden Method");
        });
    });
  });
  describe("isItReal", () => {
    it("accepts a parameter, a value and a table and returns true if the parameter is on the table", () => {
      return isItReal({ topic: "mitch" }, "topics").then(data => {
        expect(data).to.equal(true);
      });
    });
    it("returns false for failing queries", () => {
      return isItReal({ topic: "not a topic" }, "topics").then(data => {
        expect(data).to.equal(false);
      });
    });
    it("also returns true when checking for usernames", () => {
      return isItReal({ author: "icellusedkars" }, "users").then(data => {
        expect(data).to.equal(true);
      });
    });
    it("also returns true when checking for usernames", () => {
      return isItReal({ author: "notarealperson" }, "users").then(data => {
        expect(data).to.equal(false);
      });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("PATCH 200, accepts a body in the form of votes, responds with a 201 status and the updated comment", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(data => {
          expect(data.body.comment.votes).to.equal(17);
        });
    });
    it("PATCH 200 when passed a negative number, decreases the votes", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -5 })
        .expect(200)
        .then(data => {
          expect(data.body.comment.votes).to.equal(11);
        });
    });
    it("PATCH 200 when sent a patch request with no inc_votes quality, returns the unchanged comment", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(200)
        .then(data => {
          expect(data.body.comment.votes).to.equal(16);
        });
    });
    it("PATCH 400 and an appropriate error message when passed a bad data type", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "ten" })
        .expect(400)
        .then(data => {
          expect(data.body.msg).to.equal("Bad data type");
        });
    });
    it("PATCH 404 and an appropriate error message when passed a comment that doesn't exist", () => {
      return request(app)
        .patch("/api/comments/9999")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(data => {
          expect(data.body.msg).to.equal("content not found");
        });
    });
    it("DELETE 204 returns no content", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204);
    });
    it("DELETE 404 returns an appropriate error message when used on a comment that does not exist", () => {
      return request(app)
        .delete("/api/comments/1000")
        .expect(404)
        .then(data => {
          expect(data.body.msg).to.equal("content not found");
        });
    });
    it("DELETE 400 returns an appropriate error message when passed a bad data type for comment id", () => {
      return request(app)
        .delete("/api/comments/my-real-comment")
        .expect(400)
        .then(data => {
          expect(data.body.msg).to.equal("Bad data type");
        });
    });
  });
  describe("/api", () => {
    it("GET /api responds with a 200 status and a pkg json of the api and it's endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(data => {
          expect(data.body.api).to.be.an("object");
        });
    });
    it("DELETE /api responds with 405 status and Method Not Found", () => {
      return request(app)
        .delete("/api")
        .expect(405)
        .then(data => {
          expect(data.body.msg).to.equal("Error: Forbidden Method");
        });
    });
  });
});
