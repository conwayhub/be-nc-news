const connection = require("../db/connection");

const getArticlesByID = ({ params, body }) => {
  console.log(body.inc_votes);
  return (
    connection("articles")
      .first("articles.*")
      .where("articles.article_id", "=", params.article_id)
      .groupBy("articles.article_id")
      //.groupBy("articles.article_id")
      .count({ comment_count: "comments.article_id" })
      .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
      .modify(query => {
        if (body.inc_votes) {
          query.increment("votes", body.inc_votes).returning("*");
        }
      })
  );
};

const postCommentToArticle = ({ params, body }) => {
  return connection("comments")
    .insert({
      author: body.username,
      article_id: params.article_id,
      body: body.body,
      created_at: new Date()
    })
    .returning("*")
    .then(array => {
      return array[0];
    });
};

const getCommentsByArticleID = ({ params }) => {
  return connection("comments")
    .select("*")
    .where("comments.article_id", "=", params.article_id);
};

/*
const patchArticleWithVotes = ({ params, body }) => {
  console.log(params.article_id, body.inc_votes);
  return connection("articles")
    .first("articles.*")
    .where("articles.article_id", "=", params.article_id)
    .modify(query => {
      if (body.inc_votes) {
        if (body.inc_votes > 0) {
          query.increment("votes", body.inc_votes);
        } else if (body.inc_votes < 0) {
          query.decrement("votes", body.inc_votes);
        }
      }
    })
    .returning("*");
};
*/
module.exports = {
  getCommentsByArticleID,
  getArticlesByID,
  postCommentToArticle //patchArticleWithVotes
};
