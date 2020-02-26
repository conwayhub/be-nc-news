const { getUserByUN } = require("../models/users.models");

const fetchUserByUsername = (req, res, next) => {
  getUserByUN(req.params).then(data => {
    if (data.length === 0) {
      next({ status: 404 });
    } else {
      res.status(200).send({ user: data[0] });
    }
  });
};

module.exports = { fetchUserByUsername };
