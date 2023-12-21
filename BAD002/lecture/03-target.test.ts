import { Person, isLegalToDrink } from './03-lib'
import { entryGuard } from './03-target'
import * as lib from './03-lib'

jest.mock('./03-lib')
let isLegalToDrinkMock = isLegalToDrink as jest.Mock

describe('test bar entry guard', () => {
  beforeEach(() => {
    isLegalToDrinkMock.mockReset()
  })

  it('should check if the user is legal to drink in HK', () => {
    // console.log('entryGuard:', entryGuard)
    // console.log('isLegalToDrink:', isLegalToDrink)
    // console.log('lib:', lib)

    let alice = { name: 'alice', age: 17 }
    let bob = { name: 'alice', age: 18 }
    let charlie = { name: 'alice', age: 19 }
    let persons = [alice, bob, charlie]

    isLegalToDrinkMock.mockImplementation((person: Person) => person.age >= 18)

    let result = entryGuard(persons)
    expect(isLegalToDrink).toHaveBeenCalledTimes(persons.length)
    expect(result.allowList).toEqual([bob, charlie])
    expect(result.rejectList).toEqual([alice])
  })

  it('should check if the user is legal to drink in US', () => {
    let alice = { name: 'alice', age: 20 }
    let bob = { name: 'alice', age: 21 }
    let charlie = { name: 'alice', age: 22 }
    let persons = [alice, bob, charlie]

    isLegalToDrinkMock.mockImplementation((person: Person) => person.age >= 21)

    let result = entryGuard(persons)
    expect(isLegalToDrink).toHaveBeenCalledTimes(persons.length)
    expect(result.allowList).toEqual([bob, charlie])
    expect(result.rejectList).toEqual([alice])
  })
})