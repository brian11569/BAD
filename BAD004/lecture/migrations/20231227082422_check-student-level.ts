import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('student', table => {
    table.check('level >= 1', {}, 'check_student_level')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('student', table => {
    table.dropChecks('check_student_level')
  })
}