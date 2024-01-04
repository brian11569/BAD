import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('teacher', table => {
    table.increments('id')
    table.string('name', 32)
    table.date('date_of_birth')
    table.timestamps(false, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('teacher')
}