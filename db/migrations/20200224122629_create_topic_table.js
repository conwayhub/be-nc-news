exports.up = function(knex) {
  console.log("makin' tables!");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .primary()
      .notNullable();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  console.log("droppin' tables!");
  return knex.schema.dropTable("topics");
};
