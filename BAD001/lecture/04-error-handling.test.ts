import { divide } from './04-error-handling'

test('divide() should reject dividing by zero', () => {
  expect(() => divide(1, 0)).toThrow(/divide by zero/i)
})

test('divide() should reject NaN inputs', () => {
  let a = 'alice'
  let b = 'bob'
  expect(() => divide(+a, parseInt(b))).toThrow(/invalid input.*nan/i)
})
