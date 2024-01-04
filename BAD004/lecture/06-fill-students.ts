import { knex } from './db'
import { startTimer } from '@beenotung/tslib/timer'

async function main() {
  let n = 100_000
  let timer = startTimer('fill students')
  timer.setEstimateProgress(n)
  for (let i = 0; i < n; i++) {
    await knex('student').insert({
      name: 'student ' + (i + 1),
      level: Math.floor(Math.random() * 100) + 1,
    })
    timer.tick()
  }
  timer.end()
}
main()
  .catch(e => console.error(e))
  .then(() => knex.destroy())