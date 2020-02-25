const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("when passed an empty array, returns an empty array", () => {
    expect(formatDates([])).to.deep.equal([]);
  });
  it("when passed one object with a sql timestamp, returns it with the timestamp converted into a javascript timestamp", () => {
    const formatted = formatDates([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ]);
    expect(formatted[0].created_at).to.deep.equal(new Date(1542284514171));
  });
  it("when passed many objects with epoch timestamps, returns them all with timestamps converted into javascript objects", () => {
    const allFormatted = formatDates([
      { name: "bob", created_at: 1542284514171, topic: "mitch" },
      {
        name: "Paulie",
        created_at: 1416140514171,
        topic: "buns"
      },
      { name: "hobgoblin", created_at: 1289996514171, topic: "tall people" }
    ]);
    allFormatted.forEach(object => {
      expect(object.created_at).to.deep.equal(new Date(object.created_at));
    });
  });
  it("when passed many objects, doesn't mutate the original objects", () => {
    const dateArray = [
      { created_by: "bob", created_at: 1542284514171, topic: "mitch" },
      {
        created_by: "Paulie",
        created_at: 1416140514171,
        topic: "buns"
      },
      {
        created_by: "hobgoblin",
        created_at: 1289996514171,
        topic: "tall people"
      }
    ];
    const allFormatted = formatDates(dateArray);
    expect(allFormatted[0].topic).to.equal("mitch");
    expect(allFormatted[0]).to.not.equal(dateArray[0]);
  });
});

describe("makeRefObj", () => {
  it("is passed an array of objects, returns an object", () => {
    expect(
      makeRefObj([{ title: "bob", article_id: 1, topic: "mitch" }])
    ).to.deep.equal({ bob: 1 });
  });
  it("if passed one object, creates a key value pair of that object's name and it's corresponding id", () => {
    expect(makeRefObj([{}]));
  });
  it("scales up when passed an array of many objects", () => {
    const objects = [
      { title: "Anne", article_id: 1, topic: "cheese" },
      { title: "Phil", article_id: 2, topic: "bum" },
      { title: "Bart", article_id: 3, topic: "poopie pants" }
    ];
    const refObj = makeRefObj(objects);
    objects.forEach(object => {
      expect(object.article_id).to.equal(refObj[object.title]);
    });
  });
});

describe("formatComments", () => {
  it("when passed an empty array, returns a different array", () => {
    const arr = [];
    expect(formatComments(arr)).to.deep.equal([]);
    expect(formatComments(arr)).to.not.equal(arr);
  });

  it("when passed one object and a reference Array, changes the key reference", () => {
    const arr = [
      { title: "Anne's Article", article_id: 1, topic: "cheese" }
      //      { title: "Phil's Article", article_id: 2, topic: "bum" },
      //      { title: "Barticle", article_id: 3, topic: "poopie pants" }
    ];
    let ref = makeRefObj(arr);
    const commentArr = [{ created_by: "paul", belongs_to: "Anne's Article" }];
    const actual = formatComments(commentArr, ref);
    expect(actual[0].article_id).to.deep.equal(1);
  });
  it("renames 'created_by' value to 'author'", () => {
    const arr = [{ title: "Anne's Article", article_id: 1, topic: "cheese" }];
    let ref = makeRefObj(arr);
    const commentArr = [{ created_by: "paul", belongs_to: "Anne's Article" }];
    const actual = formatComments(commentArr, ref);
    expect(actual[0]).to.deep.equal({ author: "paul", article_id: 1 });
  });
  it("works when scaled up to multiple objects", () => {
    const arr = [
      { title: "Anne's Article", article_id: 1, topic: "cheese" },
      { title: "Phil's Article", article_id: 2, topic: "bum" },
      { title: "Barticle", article_id: 3, topic: "poopie pants" }
    ];
    let ref = makeRefObj(arr);
    const commentArr = [
      { created_by: "paul", belongs_to: "Anne's Article" },
      { created_by: "joe", belongs_to: "Barticle" },
      { created_by: "bill", belongs_to: "Phil's Article" }
    ];
    const actual = formatComments(commentArr, ref);
    expect(actual).to.deep.equal([
      { author: "paul", article_id: 1 },
      { author: "joe", article_id: 3 },
      { author: "bill", article_id: 2 }
    ]);
  });
  it("doesn't mutate original object", () => {
    const arr = [
      { title: "Anne's Article", article_id: 1, topic: "cheese" },
      { title: "Phil's Article", article_id: 2, topic: "bum" },
      { title: "Barticle", article_id: 3, topic: "poopie pants" }
    ];
    let ref = makeRefObj(arr);
    const commentArr = [
      { created_by: "paul", belongs_to: "Anne's Article" },
      { created_by: "joe", belongs_to: "Barticle" },
      { created_by: "bill", belongs_to: "Phil's Article" }
    ];
    const commentCopy = [];
    commentArr.forEach(object => {
      commentCopy.push({ ...object });
    });
    const actual = formatComments(commentArr, ref);
    expect(commentCopy).to.deep.equal(commentArr);
    expect(actual[0]).not.to.equal(commentArr[0]);
  });
});
