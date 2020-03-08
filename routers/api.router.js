const apiRouter = require("express").Router();
const { topicsRouter } = require("./topics.router.js");
const { usersRouter } = require("./users.router");
const { articlesRouter } = require("./articles.router");
const { commentsRouter } = require("./comments.router");
const { send405Error } = require("../errors/index");
const { getApi } = require("../controllers/api.controllers");

apiRouter.use("/topics", topicsRouter).all(send405Error);
apiRouter.use("/users", usersRouter).all(send405Error);
apiRouter.use("/articles", articlesRouter).all(send405Error);
apiRouter.use("/comments", commentsRouter).all(send405Error);
apiRouter
  .route("/")
  .get(getApi)
  .all(send405Error);

module.exports = { apiRouter };
