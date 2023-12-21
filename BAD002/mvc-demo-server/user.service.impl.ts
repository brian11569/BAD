import { Client } from 'pg'
import { HttpError } from './http.error'
import { UserService } from './user.service'

export class UserServiceImpl implements UserService {
  constructor(private client: Client) {}

  login(input: {
    username: string
    password: string
  }): Promise<{ id: number }> {
    throw new HttpError(501, 'Method not implemented.')
  }

  register(input: {
    username: string
    password: string
  }): Promise<{ id: number }> {
    throw new HttpError(501, 'Method not implemented.')
  }
}