import { Person } from './01-function'

export interface Bar {
  isLegalToDrink: (person: Person) => boolean

  /* TODO test this method with jest.fn() */
  entryGuard(persons: Person[]): {
    allowList: Person[]
    rejectList: Person[]
  }
}

export class localBar implements Bar {
  constructor(
    private options: {
      legalToDrinkAge: number
    }
  ) {}
  isLegalToDrink(person: Person): boolean{
    //throw new Error('not implemented')
    return person.age >= this.options.legalToDrinkAge
  }
  entryGuard(persons: Person[]): {
    allowList: Person[]
    rejectList: Person[]
  } {
    let allowList: Person[] = []
    let rejectList: Person[] = []
    for (let person of persons) {
      if (this.isLegalToDrink(person)) {
        allowList.push(person)
      } else {
        rejectList.push(person)
      }
    }
    return {
      allowList,
      rejectList,
    }
  }
}
