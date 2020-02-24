exports.up = function(knex) {
  console.log("makin' comments!");
  return knex.schema.createTable("comments", commentTable => {
    commentTable.increments("comment_id").primary();
    commentTable
      .string("author")
      .references("users.username")
      .notNullable();
    commentTable
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    commentTable
      .integer("votes")
      .defaultTo(0)
      .notNullable();
    commentTable.timestamp("created_at", { precision: 6 });
    commentTable.text("body").notNullable();
  });
};

exports.down = function(knex) {
  console.log("droppin' comments!");
  return knex.schema.dropTable("comments");
};