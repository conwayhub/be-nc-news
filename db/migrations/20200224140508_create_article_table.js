exports.up = function(knex) {
  return knex.schema.createTable("articles", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.text("body").notNullable();
    //Check if this breaks everything by returning a weird format.
    articleTable
      .integer("votes")
      .defaultTo(0)
      .notNullable();
    articleTable.string("topic").references("topics.slug");
    articleTable.string("author").references("users.username");
    articleTable.timestamp("created_at", { precision: 6 });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
