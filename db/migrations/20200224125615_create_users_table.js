exports.up = function(knex) {
  console.log("makin' users");
  return knex.schema.createTable("users", userTable => {
    userTable
      .string("username")
      .primary()
      .unique()
      .notNullable();
    userTable.string("avatar_url").notNullable();
    userTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  console.log("droppin' users");
  return knex.schema.dropTable("users");
};
