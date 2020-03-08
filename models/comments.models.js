const connection = require("../db/connection");

const amendCommentsById = ({ params, body }) => {
  return connection("comments")
    .select("*")
    .where("comment_id", "=", params.comment_id)
    .modify(query => {
      if (body.inc_votes) {
        query.increment("votes", body.inc_votes).returning("*");
      }
    })
    .returning("*")
    .then(commentArr => {
      if (commentArr.length === 0) {
        return Promise.reject({ status: 404 });
      } else {
        return commentArr[0];
      }
    });
};

const deleteCommentsById = ({ params }) => {
  const findComment = connection("comments")
    .first("*")
    .where("comment_id", "=", params.comment_id)
    .returning("*");

  const deleteComment = connection("comments")
    .first("*")
    .where("comment_id", "=", params.comment_id)
    .del();

  return Promise.all([findComment, deleteComment]).then(array => {
    if (array[0] === undefined) {
      return Promise.reject({ status: 404 });
    } else {
      return array[1];
    }
  });
};

module.exports = { amendCommentsById, deleteCommentsById };
