import { Knex } from 'knex'
import { seedRow } from '../lib/knex-seed'
import { hashPassword } from '../hash'

export async function seed(knex: Knex): Promise<void> {
  let user_alice_id = await seedRow(
    knex,
    'user',
    { username: 'alice' },
    { password_hash: await hashPassword('secret123') },
  )
  await seedRow(
    knex,
    'user',
    { username: 'bob' },
    { password_hash: await hashPassword('secret') },
  )

  await seedRow(knex, 'memo', { content: 'hello world', is_sample: true })
  let memo_knex_id = await seedRow(knex, 'memo', {
    content: "let's try knex",
    is_sample: true,
  })
  await seedRow(knex, 'memo', {
    content: 'introduction to sql query builder',
    is_sample: true,
  })

  await seedRow(
    knex,
    'image',
    { memo_id: memo_knex_id },
    { filename: 'knex.png' },
  )
}