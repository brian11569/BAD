import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.string('email').unique()
    table.specificType('tel', 'char(8)').unique()
    table.string('avatar', 41) // 36 char for uuid, 5 char for extname
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.dropColumns('email', 'tel', 'avatar')
  })
}