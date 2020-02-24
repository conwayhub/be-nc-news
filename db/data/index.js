const ENV = process.env.NODE_END || "development";

const testData = require("./test-data");
const devData = require("./development-data");

const data = { test: testData, development: devData };

module.exports = data[ENV];
