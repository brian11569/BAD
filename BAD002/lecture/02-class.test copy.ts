import { Bar, localBar } from './02-class'
import { Person } from './01-function'

describe('test bar entry guard', () => {
  it('should check if the user is legal to drink in HK', () => {
    let bar = new localBar({legalToDrinkAge: 18})

    let alice = { name: 'alice', age: 17 }
    let bob = { name: 'alice', age: 18 }
    let charlie = { name: 'alice', age: 19 }
    let persons = [alice, bob, charlie]
    let isLegalToDrink = (person: Person) => person.age >= 18
    isLegalToDrink = jest.fn(isLegalToDrink)
    let result = bar.entryGuard(persons)
    expect(isLegalToDrink).toHaveBeenCalledTimes(persons.length)
    expect(result.allowList).toEqual([bob, charlie])
    expect(result.rejectList).toEqual([alice])
  })

  it('should check if the user is legal to drink in US', () => {
    let bar = new localBar({legalToDrinkAge: 21})

    let alice = { name: 'alice', age: 20 }
    let bob = { name: 'alice', age: 21 }
    let charlie = { name: 'alice', age: 22 }
    let persons = [alice, bob, charlie]
    let isLegalToDrink = (person: Person) => person.age >= 21
    isLegalToDrink = jest.fn(isLegalToDrink)
    let result = bar.entryGuard(persons)
    expect(isLegalToDrink).toHaveBeenCalledTimes(persons.length)
    expect(result.allowList).toEqual([bob, charlie])
    expect(result.rejectList).toEqual([alice])
  })
})