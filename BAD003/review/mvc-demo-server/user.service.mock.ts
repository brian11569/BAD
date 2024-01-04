import { UserService } from './user.service'

export class UserServiceMock implements UserService {
  constructor() {}

  login(input: {
    username: string
    password: string
  }): Promise<{ id: number }> {
    throw new Error('forget to mock this method?')
  }

  register(input: {
    username: string
    password: string
  }): Promise<{ id: number }> {
    throw new Error('forget to mock this method?')
  }
}