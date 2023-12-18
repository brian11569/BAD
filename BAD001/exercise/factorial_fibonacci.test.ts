import { factorial, fibonacci } from './factorial_fibonacci'
import { HttpError } from './http.error'

describe('factorial', ()=>{
    test('factorial() should have 1 argument only', ()=>{
        expect(factorial).toHaveLength(1)
    })
    
    test('factorial() should reject NaN inputs', ()=>{
        let a = 'a'
        expect(() => factorial(+a)).toThrow(/Invalid input: integer required/i)
    })
    
    test('factorial(0) & factorial(1) should return 1', ()=>{
        expect(factorial(0)).toBe(1)
        expect(factorial(1)).toBe(1)
    })
    
    test('factorial(n) where n is not 0 or 1 should return multiplication of numbers from 1 to n', ()=>{
        let n: number = 5;
        expect(factorial(n)).toBe(factorial(n-1)*n)
    })
})

describe('fibonacci', ()=>{
    test('fibonacci() should have 1 argument only', ()=>{
        expect(fibonacci).toHaveLength(1)
    })
    
    test('fibonacci() should reject NaN inputs', ()=>{
        let a = 'a'
        expect(() => fibonacci(+a)).toThrow(/Invalid input: integer required/i)
    })
    
    test('fibonacci(0) should return 0', ()=>{
        expect(fibonacci(0)).toBe(0)
    })

    test('fibonacci(1) & fibonacci(2) should return 1', ()=>{
        expect(fibonacci(1)).toBe(1)
        expect(fibonacci(2)).toBe(1)
    })
    
    test('factorial(n) where n is not 0 or 1 should return multiplication of numbers from 1 to n', ()=>{
        for (let n of [10, 5, 20]){
            expect(fibonacci(n)).toBe(fibonacci(n-1)+fibonacci(n-2))
        }
    })
})
