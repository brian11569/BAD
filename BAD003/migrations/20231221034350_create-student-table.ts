import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('student', table => {
    table.increments()
    table.string('name', 32).notNullable()
    table.string('level', 1)
    table.integer('teacher_id').notNullable().references('teacher.id')
    table.timestamps(false, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('student')
}