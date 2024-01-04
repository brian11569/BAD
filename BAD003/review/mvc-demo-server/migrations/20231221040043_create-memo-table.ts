import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('memo'))) {
    await knex.schema.createTable('memo', table => {
      table.increments()
      table.text('content').notNullable()
      table.boolean('is_sample').notNullable()
      table.timestamps(false, true)
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('memo')
}