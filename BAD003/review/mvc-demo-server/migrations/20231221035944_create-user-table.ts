import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // postgres: "user"
  // sqlite: `user`
  // mssql: [user]
  if (!(await knex.schema.hasTable('user'))) {
    await knex.schema.createTable('user', table => {
      table.increments()
      table.string('username', 32).notNullable().unique()
      table.string('password', 2048).notNullable()
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user')
}