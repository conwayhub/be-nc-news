const connection = require("../db/connection.js");

const getAllTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

module.exports = { getAllTopics };
