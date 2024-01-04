import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('teacher', table => {
    table.dropColumn('level')
    table.string('subject', 32).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('teacher', table => {
    table.integer('level').unsigned().nullable()
    table.dropColumn('subject')
  })
}