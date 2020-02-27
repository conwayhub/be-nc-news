const connection = require("../db/connection");

const getArticlesByID = ({ params, body, query }) => {
  console.log("1");
  let reality = true;

  if (query.author) {
    console.log("2");
    reality = isItReal(query, "users");
  } else if (query.topic) {
    reality = isItReal(query, "topics");
  } else {
    reality = [1];
  }
  const articles = connection("articles")
    .select("articles.*")
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.article_id" })
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .modify(queryById => {
      if (params.article_id) {
        queryById
          .first("articles.*")
          .where("articles.article_id", "=", params.article_id)
          .modify(articleVotes => {
            if (body.inc_votes) {
              articleVotes.increment("votes", body.inc_votes).returning("*");
            }
          });
      }
    })
    .modify(queryByAuthor => {
      if (query.author) {
        queryByAuthor.where("articles.author", "=", query.author);
      }
    })
    .modify(queryByTopic => {
      if (query.topic) {
        queryByTopic.where("articles.topic", "=", query.topic);
      }
    });
  return Promise.all([reality, articles]).then(data => {
    if (data[0]) {
      return data[1];
    } else {
      return Promise.reject({ status: 404 });
    }
  });
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

const getCommentsByArticleID = ({ params, query }) => {
  const comments = connection("comments")
    .select("*")
    .where("comments.article_id", "=", params.article_id)
    .orderBy(query.sort_by || "created_at", query.order || "desc");

  const articleReal = connection("articles")
    .select("*")
    .where("article_id", "=", params.article_id);

  return Promise.all([comments, articleReal]).then(
    ([comments, articleReal]) => {
      if (articleReal.length > 0) {
        return comments;
      } else {
        return Promise.reject({ status: 404 });
      }
    }
  );
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

const isItReal = (query, table) => {
  if (table === "topics") {
    return connection("topics")
      .select("*")
      .where("topics.slug", "=", query.topic)
      .then(data => {
        if (data.length === 0) {
          return false;
        } else {
          return true;
        }
      });
  } else if (table === "users") {
    return connection("users")
      .select("*")
      .where("users.username", "=", query.author)
      .then(data => {
        if (data.length === 0) {
          return false;
        } else {
          return true;
        }
      });
  }
};

module.exports = {
  isItReal,
  getCommentsByArticleID,
  getArticlesByID,
  postCommentToArticle //patchArticleWithVotes
};
