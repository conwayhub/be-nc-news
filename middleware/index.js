exports.checkForVotes = (req, res, next) => {
  if (req.body.hasOwnProperty("inc_votes")) {
    next();
  } else {
    req.body["inc_votes"] = 0;
    next();
  }
};

exports.checkValidSorting = (req, res, next) => {
  if (req.query.sort_by != undefined) {
    const acceptableValues = [
      "author",
      "title",
      "article_id",
      "body",
      "topic",
      "created_at",
      "votes",
      "comment_count"
    ];
    let acceptable = false;
    acceptableValues.forEach(value => {
      if (req.query.sort_by === value) {
        acceptable = true;
      }
    });

    if (acceptable === true) {
      next();
    } else {
      next({ status: 400 });
    }
  } else {
    next();
  }
};

// exports.checkValidCommentSorting = (req, res, next) => {
//   if (req.query.sort_by != undefined) {
//     const acceptableValues = [
//       "author",
//       "article_id",
//       "body",
//       "created_at",
//       "votes",
//       "comment_id"
//     ];
//     let acceptable = false;
//     acceptableValues.forEach(value => {
//       if (req.query.sort_by === value) {
//         acceptable = true;
//       }
//     });

//     if (acceptable === true) {
//       next();
//     } else {
//       next({ status: 400 });
//     }
//   } else {
//     next();
//   }
// };
