import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('teacher', table => {
    table.string('module', 3).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('teacher', table => {
    table.dropColumn('module')
  })
}