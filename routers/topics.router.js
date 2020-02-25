const topicsRouter = require("express").Router();
const { fetchTopics } = require("../controllers/topics.controllers");
const { send405Error } = require("../errors/index.js");

topicsRouter
  .route("/")
  .get(fetchTopics)
  .all(send405Error);

module.exports = { topicsRouter };
