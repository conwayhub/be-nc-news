const connection = require("../db/connection");

const getArticlesByID = ({ article_id }) => {
  const promise1 = connection
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .returning("*");

  const promise2 = connection
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .returning("*");

  return Promise.all([promise1, promise2]);
};

module.exports = { getArticlesByID };
