const articlesRouter = require("express").Router();
const {
  fetchArticleByID,
  takesVotesOnArticles,
  postNewComment,
  fetchCommentsByArticleID,
  fetchAllArticles
} = require("../controllers/articles.controllers");
const { checkForVotes, checkValidSorting } = require("../middleware/index");
const { send405Error } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(fetchArticleByID)
  .patch(checkForVotes, takesVotesOnArticles)
  .all(send405Error);

articlesRouter
  .route("/")
  .get(checkValidSorting, fetchAllArticles)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postNewComment)
  .get(checkValidSorting, fetchCommentsByArticleID)
  .all(send405Error);

module.exports = { articlesRouter };
