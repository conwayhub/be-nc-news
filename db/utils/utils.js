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
    newObj[object.name] = object.article_id;
  });
  return newObj;
};

exports.formatComments = (comments, articleRef) => {};
