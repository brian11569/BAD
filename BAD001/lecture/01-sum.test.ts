import sum from './01-sum'

console.log('sum:', sum)
console.log('sum.length:', sum.length)
console.log('sum.toString():', sum.toString())

test.skip('sum() should takes two arguments', () => {
  // expect(sum.length).toBe(2)
  expect(sum).toHaveLength(2)
})

test('sum(a,b) should returns the sum of a and b', () => {
  let a = 23
  let b = 56
  expect(sum(a, b)).toBe(a + b)
})

test('sum(a,b,c) should return the sum of all given numbers', () => {
  let a = 23
  let b = 56
  let c = 89
  expect(sum(a, b, c)).toBe(a + b + c)
})

test('sum(a,b,c,d,e) should return the sum of all given numbers', () => {
  let a = 23
  let b = 56
  let c = 89
  let d = 89
  let e = 89
  expect(sum(a, b, c, d, e)).toBe(a + b + c + d + e)
})
