const commentsRouter = require("express").Router();
const {
  patchCommentVotes,
  deleteComments
} = require("../controllers/comments.controllers.js");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotes)
  .delete(deleteComments);

module.exports = { commentsRouter };
