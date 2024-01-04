import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('image'))) {
    await knex.schema.createTable('image', table => {
      table.increments()
      table.integer('memo_id').notNullable().references('memo.id')
      table.string('filename', 41).notNullable()
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('image')
}