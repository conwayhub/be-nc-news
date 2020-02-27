const commentsRouter = require("express").Router();
const {
  patchCommentVotes,
  deleteComments
} = require("../controllers/comments.controllers.js");
const { send405Error } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotes)
  .delete(deleteComments)
  .all(send405Error);

module.exports = { commentsRouter };
