import { Person, isLegalToDrink } from './03-lib'

export function entryGuard(persons: Person[]): {
  allowList: Person[]
  rejectList: Person[]
} {
  let allowList: Person[] = []
  let rejectList: Person[] = []
  for (let person of persons) {
    if (isLegalToDrink(person)) {
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