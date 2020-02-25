const connection = require("../db/connection");

const getUserByUN = ({ username }) => {
  return connection
    .select("*")
    .from("users")
    .where("username", "=", username)
    .returning("*");
};

module.exports = { getUserByUN };
