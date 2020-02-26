exports.checkForValidKeys = (req, res, next) => {
  if (req.body.hasOwnProperty("inc_votes")) {
    next();
  } else {
    next({ status: 400 });
  }
};
