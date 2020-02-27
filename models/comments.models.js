const connection = require("../db/connection");

const amendCommentsById = ({ params, body }) => {
  return connection("comments")
    .first("*")
    .where("comment_id", "=", params.comment_id)
    .modify(query => {
      if (body.inc_votes) {
        console.log("hi");
        query.increment("votes", body.inc_votes);
      }
    })
    .returning("*")
    .then(commentArr => {
      return commentArr[0];
    });
};

const deleteCommentsById = ({ params }) => {
  return connection("comments")
    .first("*")
    .where("comment_id", "=", params.comment_id)
    .del();
};

module.exports = { amendCommentsById, deleteCommentsById };
