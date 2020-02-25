const articlesRouter = require("express").Router();
const { fetchArticleByID } = require("../controllers/articles.controllers");

articlesRouter.route("/:article_id").get(fetchArticleByID);

module.exports = { articlesRouter };
