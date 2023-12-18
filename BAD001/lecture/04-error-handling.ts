// defensive programming

export function divide(a: number, b: number): number {
    if (Number.isNaN(a)) {
      throw new Error('Invalid input: a is NaN')
    }
    if (Number.isNaN(b)) {
      throw new Error('Invalid input: b is NaN')
    }
    if (b == 0) {
      throw new Error('Cannot divide by zero')
    }
    return a / b
  }
  