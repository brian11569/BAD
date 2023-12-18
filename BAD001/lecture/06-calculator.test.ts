import { BasicCalculator, Calculator } from './06-calculator'

describe('Calculator Test Suit', () => {
  let calculator: Calculator

  beforeEach(() => {
    calculator = new BasicCalculator()
  })

  test('calculator should start from zero', () => {
    expect(calculator.getValue()).toBe(0)
  })

  it('should starts with zero', () => {
    expect(calculator.getValue()).toBe(0)
  })

  it('should add positive integer', () => {
    calculator.add(1)
    expect(calculator.getValue()).toBe(1)
  })

  it('should add positive floating number', () => {
    calculator.add(1.5)
    expect(calculator.getValue()).toBe(1.5)
  })

  it('should add negative integer', () => {
    calculator.add(-1)
    expect(calculator.getValue()).toBe(-1)
  })

  it('should add negative floating number', () => {
    calculator.add(-1.5)
    expect(calculator.getValue()).toBe(-1.5)
  })

  it('should calculate with precision ups to nearest ten cent', () => {
    calculator.add(0.1)
    calculator.add(0.2)
    expect(calculator.getValue()).toBe(0.3)
  })
})