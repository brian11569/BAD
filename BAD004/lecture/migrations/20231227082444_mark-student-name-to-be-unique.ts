import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('student', table => {
    table.unique('name')
  })

  // await knex.raw(/* sql */ `
  // create unique index uniq_student_name on student(name)
  // `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('student', table => {
    table.dropUnique(['name'])
  })

  //   await knex.raw(/* sql */ `
  // 	drop index uniq_student_name;
  // `)
}