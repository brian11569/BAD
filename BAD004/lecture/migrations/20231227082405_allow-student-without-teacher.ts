import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('student', table => {
    table.setNullable('teacher_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('student', table => {
    table.dropNullable('teacher_id')
  })
}