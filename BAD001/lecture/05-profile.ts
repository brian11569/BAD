import { HttpError } from './http.error'

export type User = {
  id: number
  username: string
  password: string
}

export type Profile = Omit<User, 'password'>

let users: User[] = []

users[1] = {
  id: 1,
  username: 'alice',
  password: 'secret',
}

export function getProfile(id: number): Profile {
  let user = users[id]
  if (!user) throw new HttpError(404, 'user not found')
  let { password, ...profile } = user
  return profile
}