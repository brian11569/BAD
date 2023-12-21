import { knex } from './db'

async function main() {
  await knex.insert({ name: 'alice' }).into('teacher')
  await knex('teacher').insert({ name: 'alice' })
  console.log(await knex('teacher'))

  await knex('teacher').where({ id: 2 }).delete()
  console.log(await knex('teacher'))
}

async function main1() {
  // let teachers = await knex.select('teacher.id').from('teacher')

  let query = knex('teacher')
    .select('id', 'name')
    // .where('role', 'admin')
    // .where('created_at', '<', '2023')
    // .andWhere({
    //   role: 'admin',
    //   subject: 'chinese',
    // })
    // .orWhere({
    //   role: 'director',
    // })
    .whereRaw('(role = ? and subject = ?) or (role = ?)', [
      'admin',
      'chinese',
      'director',
    ])
  console.log('query:', query.toSQL())
  // let teachers = await query
  // console.log('teachers:', teachers)

  let query2 = knex.raw('select 1')
  console.log('query2:', query2.toSQL())
  let result2 = await query2
  // console.log('result2:', result2)
  console.log('result2.rows:', result2.rows)
}
main()
  .catch(e => console.error(e))
  .then(() => knex.destroy())