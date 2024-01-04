import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('teaching', table => {
    table.increments()
    table.integer('teacher_id').notNullable().references('teacher.id')
    table.integer('student_id').notNullable().references('student.id')
    table.timestamps(false, true)
  })

  for (let student of await knex('student').select('id', 'teacher_id')) {
    await knex('teaching').insert({
      teacher_id: student.teacher_id,
      student_id: student.id,
    })
  }

  await knex.schema.alterTable('student', table => {
    table.dropColumn('teacher_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('student', table => {
    table.integer('teacher_id').nullable()
  })

  for (let teaching of await knex('teaching').select(
    'teacher_id',
    'student_id',
  )) {
    await knex('student')
      .where({ id: teaching.student_id })
      .update({ teacher_id: teaching.teacher_id })
  }

  await knex.schema.alterTable('student', table => {
    table.dropNullable('teacher_id')
  })
  await knex.schema.dropTable('teaching')
}