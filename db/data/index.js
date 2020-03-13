const ENV = process.env.NODE_ENV || "development";

const testData = require("./test-data");
const devData = require("./development-data");

const data = { test: testData, production: devData, development: devData };

module.exports = data[ENV];
