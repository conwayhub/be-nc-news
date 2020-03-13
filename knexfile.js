const ENV = process.env.NODE_ENV || "development";
const { customConfig } = require("./customDb");
const { DB_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
