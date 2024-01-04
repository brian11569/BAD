import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await seed_v2_many_to_many(knex)
}

export async function seed_v1_one_to_many(knex: Knex): Promise<void> {
  async function seedRow(
    table: string,
    filter: object,
    extraData?: object,
  ): Promise<number> {
    let row = await knex(table).where(filter).select('id').first()
    if (row) {
      if (extraData) {
        await knex(table).where(row).update(extraData)
      }
      return row.id
    }

    //   let [{ id }] = await knex(table)
    //     .insert({ ...filter, ...extraData })
    //     .returning('id')
    //   return id

    let rows = await knex(table)
      .insert({ ...filter, ...extraData })
      .returning('id')
    return rows[0].id
  }

  let teacher_alice_id = await seedRow(
    'teacher',
    { name: 'alice' },
    { module: 'BAD' },
  )

  await seedRow(
    'student',
    { name: 'alex' },
    {
      teacher_id: teacher_alice_id,
      level: 'A',
    },
  )
  await seedRow(
    'student',
    { name: 'ariel' },
    {
      teacher_id: teacher_alice_id,
      level: 'A',
    },
  )
  await seedRow(
    'student',
    { name: 'alexander' },
    {
      teacher_id: teacher_alice_id,
      level: 'A',
    },
  )

  let teacher_bob_id = await seedRow(
    'teacher',
    { name: 'bob' },
    { module: 'FRD' },
  )
  await seedRow(
    'student',
    { name: 'bobby' },
    { teacher_id: teacher_bob_id, level: 'B' },
  )
  await seedRow(
    'student',
    { name: 'ben' },
    { teacher_id: teacher_bob_id, level: 'B' },
  )
}

export async function seed_v2_many_to_many(knex: Knex): Promise<void> {
  async function seedRow(
    table: string,
    filter: object,
    extraData?: object,
  ): Promise<number> {
    let row = await knex(table).where(filter).select('id').first()
    if (row) {
      if (extraData) {
        await knex(table).where(row).update(extraData)
      }
      return row.id
    }

    let [{ id }] = await knex(table)
      .insert({ ...filter, ...extraData })
      .returning('id')
    return id
  }

  let teacher_alice_id = await seedRow(
    'teacher',
    { name: 'alice' },
    { module: 'BAD' },
  )
  let teacher_bob_id = await seedRow(
    'teacher',
    { name: 'bob' },
    { module: 'FRD' },
  )

  let student_alex_id = await seedRow(
    'student',
    { name: 'alex' },
    {
      level: 'A',
    },
  )
  await seedRow('teaching', {
    teacher_id: teacher_alice_id,
    student_id: student_alex_id,
  })
  await seedRow('teaching', {
    teacher_id: teacher_bob_id,
    student_id: student_alex_id,
  })

  await seedRow(
    'student',
    { name: 'ariel' },
    {
      // teacher_id: teacher_alice_id,
      level: 'A',
    },
  )
  await seedRow(
    'student',
    { name: 'alexander' },
    {
      // teacher_id: teacher_alice_id,
      level: 'A',
    },
  )

  await seedRow(
    'student',
    { name: 'bobby' },
    // { teacher_id: teacher_bob_id, level: 'B' },
  )
  await seedRow(
    'student',
    { name: 'ben' },
    // { teacher_id: teacher_bob_id, level: 'B' },
  )
}