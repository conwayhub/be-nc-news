const ENV = process.env.NODE_ENV || "development";
//const { customConfig } = require("./customDb");
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

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      user: "conway",
      password: "password1"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      user: "conway",
      password: "password1"
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
