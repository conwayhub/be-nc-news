const commentsRouter = require("express").Router();
const {
  patchCommentVotes,
  deleteComments
} = require("../controllers/comments.controllers.js");
const { checkForVotes } = require("../middleware/index");
const { send405Error } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(checkForVotes, patchCommentVotes)
  .delete(deleteComments)
  .all(send405Error);

module.exports = { commentsRouter };
