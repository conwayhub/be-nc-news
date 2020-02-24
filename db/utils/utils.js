exports.formatDates = list => {
  newArr = [];
  list.forEach(element => {
    let newObj = { ...element };
    const date = element.created_at;
    delete newObj.created_at;
    newObj.created_at = new Date(date);
    newArr.push(newObj);
  });
  return newArr;
};

exports.makeRefObj = list => {
  newObj = {};
  list.forEach(object => {
    newObj[object.title] = object.article_id;
  });
  return newObj;
};

exports.formatComments = (comments, articleRef) => {
  // {fave article: annes article}
  //{anne's article: 4}
  const newArr = [];
  comments.forEach(object => {
    const newObj = { ...object };
    newObj.author = object.created_by;
    delete newObj.created_by;
    newObj.article_id = articleRef[object.belongs_to];

    delete newObj.belongs_to;

    newArr.push(newObj);
  });
  return newArr;
};
