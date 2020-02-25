const { getAllTopics } = require("../models/topics.models.js");

const fetchTopics = (req, res, next) => {
  getAllTopics().then(data => {
    return res.status(200).send({ topics: data });
  });
};

module.exports = { fetchTopics };
