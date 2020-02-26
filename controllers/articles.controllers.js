const {
  getCommentsByArticleID,
  getArticlesByID,
  postCommentToArticle
  //  patchArticleWithVotes
} = require("../models/articles.models.js");

const fetchArticleByID = (req, res, next) => {
  getArticlesByID(req)
    .then(article => {
      if (article !== undefined) {
        res.status(200).send({ article });
      } else {
        next({ status: 404 });
      }
    })
    .catch(err => {
      next(err);
    });
};

const takesVotesOnArticles = (req, res, next) => {
  console.log("hello");
  getArticlesByID(req)
    .then(article => {
      res.status(200).send({ article: article[0] });
    })
    .catch(err => {
      next(err);
    });
};

const fetchCommentsByArticleID = (req, res, next) => {
  getCommentsByArticleID(req).then(comments => {
    res.status(200).send({ comments });
  });
};

const postNewComment = (req, res, next) => {
  postCommentToArticle(req).then(comment => {
    res.status(201).send({ comment });
  });
};

module.exports = {
  fetchArticleByID,
  takesVotesOnArticles,
  postNewComment,
  fetchCommentsByArticleID
};
