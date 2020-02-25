const usersRouter = require("express").Router();
const { fetchUserByUsername } = require("../controllers/users.controllers");
const { send405Error } = require("../errors");

usersRouter
  .route("/:username")
  .get(fetchUserByUsername)
  .all(send405Error);

module.exports = { usersRouter };
