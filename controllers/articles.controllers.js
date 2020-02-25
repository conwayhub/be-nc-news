const { getArticlesByID } = require("../models/articles.models.js");

const fetchArticleByID = (req, res, next) => {
  getArticlesByID(req.params).then(data => {
    const articleObj = { article: data[0][0] };
    articleObj.article["comment_count"] = data[1].length;
    res.status(200).send(articleObj);
  });
};

module.exports = { fetchArticleByID };
