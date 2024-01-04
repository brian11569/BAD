import { Knex } from 'knex'

export async function seedRow(
  knex: Knex,
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