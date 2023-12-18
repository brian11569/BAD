// other examples of variadic functions:
// array.push()
// Math.max()

// use ... to implement variadic function taking arbitrary number of additional arguments
function sum(a: number, ...rest: number[]): number {
  let acc = a
  for (let num of rest) {
    acc += num
  }
  return acc
}

export default sum
