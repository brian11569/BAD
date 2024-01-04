import { knex } from './db'

async function main() {
  await knex('student').insert({
    name: 'eve',
    level: -1,
  })
}
main()
  .catch(e => console.error(e))
  .then(() => knex.destroy())