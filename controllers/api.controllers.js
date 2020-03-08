const { fetchApiJson } = require("../models/api.models");
const api = require(".././endpoints.json");

const getApi = (req, res, next) => {
  return res.status(200).send({ api: api });
};

module.exports = { getApi };
