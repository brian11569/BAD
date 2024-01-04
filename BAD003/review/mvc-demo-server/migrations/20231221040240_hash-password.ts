import type { Knex } from 'knex'
import { hashPassword } from '../hash'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.specificType('password_hash', 'char(60)')
  })

  for (let user of await knex('user').select('id', 'password')) {
    await knex('user')
      .where({ id: user.id })
      .update({ password_hash: await hashPassword(user.password) })
  }

  await knex.schema.alterTable('user', table => {
    table.dropColumn('password')
    table.dropNullable('password_hash')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.string('password', 2048)
    table.dropColumn('password_hash')
  })

  await knex('user').update({ password: '' })

  await knex.schema.alterTable('user', table => {
    table.dropNullable('password')
  })
}