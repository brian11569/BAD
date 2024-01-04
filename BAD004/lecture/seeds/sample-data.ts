import { Knex } from 'knex'
import { seedRow } from '../lib/knex-seed'

export async function seed(knex: Knex): Promise<void> {
  let teacher_bob_id = await seedRow(
    knex,
    'teacher',
    { name: 'Bob' },
    { subject: 'BAD' },
  )
  let teacher_herman_id = await seedRow(
    knex,
    'teacher',
    { name: 'Herman' },
    { subject: 'HCI' },
  )
  let teacher_bobby_id = await seedRow(
    knex,
    'teacher',
    { name: 'Bobby' },
    { subject: 'BAD' },
  )

  await seedRow(
    knex,
    'student',
    { name: 'Peter' },
    { level: 25, teacher_id: teacher_bob_id },
  )
  await seedRow(
    knex,
    'student',
    { name: 'John' },
    { level: 20, teacher_id: teacher_bob_id },
  )
  await seedRow(
    knex,
    'student',
    { name: 'Simon' },
    { level: 15, teacher_id: null },
  )
  await seedRow(
    knex,
    'student',
    { name: 'Andy' },
    { level: 5, teacher_id: teacher_bob_id },
  )
  await seedRow(
    knex,
    'student',
    { name: 'Cesar' },
    { level: 10, teacher_id: teacher_herman_id },
  )
  await seedRow(
    knex,
    'student',
    { name: 'Danny' },
    { level: 30, teacher_id: teacher_herman_id },
  )
  await seedRow(
    knex,
    'student',
    { name: 'Ben' },
    { level: 15, teacher_id: teacher_bobby_id },
  )
}