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
      { name: "bob", created_at: 1542284514171, topic: "mitch" },
      {
        name: "Paulie",
        created_at: 1416140514171,
        topic: "buns"
      },
      { name: "hobgoblin", created_at: 1289996514171, topic: "tall people" }
    ];
    const allFormatted = formatDates(dateArray);
    expect(allFormatted[0].name).to.equal("bob");
    expect(allFormatted[0].topic).to.equal("mitch");
    expect(allFormatted[0]).to.not.equal(dateArray[0]);
  });
});

describe("makeRefObj", () => {
  it("is passed an array of objects, returns an object", () => {
    expect(
      makeRefObj([{ name: "bob", article_id: 1, topic: "mitch" }])
    ).to.deep.equal({ bob: 1 });
  });
  it("if passed one object, creates a key value pair of that object's name and it's corresponding id", () => {
    expect(makeRefObj([{}]));
  });
  it("scales up when passed an array of many objects", () => {
    const objects = [
      { name: "Anne", article_id: 1, topic: "cheese" },
      { name: "Phil", article_id: 2, topic: "bum" },
      { name: "Bart", article_id: 3, topic: "poopie pants" }
    ];
    const refObj = makeRefObj(objects);
    objects.forEach(object => {
      expect(object.article_id).to.equal(refObj[object.name]);
    });
  });
});

describe("formatComments", () => {});
