import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('teacher', table => {
    table.dropNullable('name')
  })
  await knex.schema.alterTable('student', table => {
    table.dropNullable('level')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('student', table => {
    table.setNullable('level')
  })
  await knex.schema.alterTable('teacher', table => {
    table.setNullable('name')
  })
}