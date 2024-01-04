/* 
1: count student per teacher
2: find average level of students per teacher
3: find sum of level of students per subject
4: find student count per subject
*/

import { knex } from './db'

async function main() {
  console.log('1: count student per teacher')
  console.log(
    await knex('student')
      .groupBy('teacher_id')
      .select('teacher_id')
      .count('id as student_count')
      .whereNotNull('teacher_id'),
  )

  console.log('2: find average level of students per teacher')
  console.log(
    await knex('student')
      .groupBy('teacher_id')
      .select('teacher_id')
      .avg('level as average_level')
      .whereNotNull('teacher_id'),
  )
  console.log(
    await knex('student')
      .innerJoin('teacher', 'teacher.id', 'student.teacher_id')
      .select('teacher.name')
      .groupBy('teacher.id')
      .select('teacher.id')
      .avg('level as average_level')
      .whereNotNull('teacher_id'),
  )

  console.log('3: find sum of level of students per subject')
  console.log(
    await knex('student')
      .innerJoin('teacher', 'teacher.id', 'student.teacher_id')
      .groupBy('teacher.subject')
      .select('teacher.subject')
      .avg('level as average_level'),
  )
  console.log(
    await knex('student')
      .innerJoin('teacher', 'teacher.id', 'student.teacher_id')
      .groupBy('teacher.subject')
      .select(
        'teacher.subject',
        knex.raw('sum(level) / count(student.id) as average_level'),
      ),
  )
  console.log(
    await knex('student')
      .innerJoin('teacher', 'teacher.id', 'student.teacher_id')
      .groupBy('teacher.subject')
      .select(
        'teacher.subject',
        knex.raw(
          '(sum(level) * 10 / count(student.id)) / 10.0 as average_level',
        ),
      ),
  )

  console.log('4: find student count per subject')
  console.log(
    await knex('student')
      .innerJoin('teacher', 'teacher.id', 'student.teacher_id')
      .groupBy('teacher.subject')
      .select('teacher.subject')
      .count('student.id as student_count'),
  )
}
main()
  .catch(e => console.error(e))
  .then(() => knex.destroy())