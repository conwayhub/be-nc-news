const articlesRouter = require("express").Router();
const {
  fetchArticleByID,
  takesVotesOnArticles,
  postNewComment,
  fetchCommentsByArticleID,
  fetchAllArticles
} = require("../controllers/articles.controllers");
//const { checkForValidKeys } = require("../middleware/index");
const { send405Error } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(fetchArticleByID)
  .patch(takesVotesOnArticles)
  .all(send405Error);

articlesRouter.route("/").get(fetchAllArticles);

articlesRouter
  .route("/:article_id/comments")
  .post(postNewComment)
  .get(fetchCommentsByArticleID)
  .all(send405Error);

module.exports = { articlesRouter };
