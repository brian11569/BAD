import { knex } from './db'

async function main() {
  let students = await knex('student')
  console.log('students:', students)

  let teachers = await knex('teacher')
  console.log('teachers:', teachers)

  let result = await knex.raw(/* sql */ `
	select
	  count(id) as count
	from student
	`)
  console.log('student stats:', result.rows)

  result = await knex.raw(/* sql */ `
	select
	  count(id) as count
	from teacher
	`)
  console.log('teacher stats:', result.rows)

  result = await knex.raw(/* sql */ `
	select
	  (select count(id) from teacher) as teacher_count
	, (select count(id) from student) as student_count
	`)
  console.log('user stats (3 select):', result.rows)

  result = await knex.raw(/* sql */ `
	select 'teacher' as role, count(id) as count from teacher
	union
	select 'student' as role, count(id) as count from student
	`)
  console.log('user stats (union):', result.rows)

  result = await knex.raw(/* sql */ `
	select
	  teacher.id
	, teacher.name
	, count(student.id) as student_count
	from teacher
	inner join student on student.teacher_id = teacher.id
	group by teacher.id
	`)
  console.log('teacher groups (raw sql):', result.rows)

  let teacherGroups = await knex
    .from('teacher')
    .innerJoin('student', 'student.teacher_id', 'teacher.id')
    .groupBy('teacher.id')
    .select('teacher.id', 'teacher.name')
    .count('student.id as student_count')
  console.log('teacher groups (knex):', teacherGroups)

  result = await knex.raw(/* sql */ `
 select '0 - 9' as range, count(id) as student_count from student where level between 0 and 9
 union
 select '10 - 19' as range, count(id) as student_count from student where level between 10 and 19
 union
 select '20 - 29' as range, count(id) as student_count from student where level between 20 and 29
 union
 select '30 - 39' as range, count(id) as student_count from student where level between 30 and 39
	`)
  console.log('student stats:', result.rows)

  result = await knex.raw(/* sql */ `
 select 0 as lower_bound, 9 as upper_bound, count(id) as student_count from student where level between 0 and 9
 union
 select 10 as lower_bound, 19 as upper_bound, count(id) as student_count from student where level between 10 and 19
	`)
  console.log('student stats:', result.rows)

  // faster version
  result = await knex.raw(/* sql */ `
with range as (
	select 0 as lower_bound, 9 as upper_bound
	union
	select 10 as lower_bound, 19 as upper_bound
	union
	select 20 as lower_bound, 29 as upper_bound
	union
	select 30 as lower_bound, 39 as upper_bound
)
select
  range.lower_bound
, range.upper_bound
, count(student.id) as student_count
from student
inner join range on student.level between range.lower_bound and range.upper_bound
group by range.lower_bound, range.upper_bound
	`)
  console.log('student stats:', result.rows)

  // slower version
  result = await knex.raw(/* sql */ `
with range as (
	select 0 as lower_bound, 9 as upper_bound
	union
	select 10 as lower_bound, 19 as upper_bound
	union
	select 20 as lower_bound, 29 as upper_bound
	union
	select 30 as lower_bound, 39 as upper_bound
)
select
  range.lower_bound
, range.upper_bound
, count(student.id) as student_count
from range
inner join student on student.level between range.lower_bound and range.upper_bound
group by range.lower_bound, range.upper_bound
	`)
  console.log('student stats:', result.rows)
}

main()
  .catch(e => console.error(e))
  .then(() => knex.destroy())