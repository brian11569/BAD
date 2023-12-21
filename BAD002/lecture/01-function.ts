export type Person = {
    name: string
    age: number
  }
  
  export function entryGuard(input: {
    persons: Person[]
    isLegalToDrink: (person: Person) => boolean
  }): {
    allowList: Person[]
    rejectList: Person[]
  } {
    let allowList: Person[] = []
    let rejectList: Person[] = []
    for (let person of input.persons) {
      if (input.isLegalToDrink(person)) {
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