import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('teacher', table => {
    table.increments()
    table.string('name', 50).notNullable()
    table.integer('level').unsigned().notNullable()
    table.timestamps(false, true)
  })
  await knex.schema.createTable('student', table => {
    table.increments()
    table.string('name', 50).notNullable()
    table.integer('level').unsigned().notNullable()
    table.integer('teacher_id').notNullable().references('teacher.id')
    table.timestamps(false, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('student')
  await knex.schema.dropTable('teacher')
}