const {
  amendCommentsById,
  deleteCommentsById
} = require("../models/comments.models.js");

const patchCommentVotes = (req, res, next) => {
  amendCommentsById(req)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

const deleteComments = (req, res, next) => {
  deleteCommentsById(req).then(no_content => {
    res.status(204).send();
  });
};

module.exports = { patchCommentVotes, deleteComments };
