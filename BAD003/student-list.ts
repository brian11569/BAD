import { knex } from './db'

async function main() {
  let rows = await knex('student')
    .where({ 'student.name': 'alex' })
    .innerJoin('teaching', 'teaching.student_id', 'student.id')
    .innerJoin('teacher', 'teaching.teacher_id', 'teacher.id')
    .select('student.id as student_id')
    .select('teacher.id as teacher_id')
    .select('teacher.name as teacher_name')
    .select('student.name as student_name')
    .select('teacher.module')

  console.log(rows)
}

main()
  .catch(e => console.error(e))
  .then(() => knex.destroy())