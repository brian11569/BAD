import { Client } from 'pg'
import { HttpError } from './http.error'
import { UserService } from './user.service'
import { Knex } from 'knex'
import { comparePassword, hashPassword } from './hash'

export class UserServiceImpl implements UserService {
  constructor(private knex: Knex) {}

  async login(input: {
    username: string
    password: string
  }): Promise<{ id: number }> {
    let user = await this.knex('user')
      .select('id', 'password_hash')
      .where({ username: input.username })
      .first()
    if (!user) throw new HttpError(404, 'user not found')
    let is_matched = await comparePassword({
      password: input.password,
      password_hash: user.password_hash,
    })
    if (!is_matched) throw new HttpError(401, 'wrong username or password')
    return { id: user.id }
  }

  async register(input: {
    username: string
    password: string
    avatar: string | null
    email: string
    tel: string
  }): Promise<{ id: number }> {
    try {
      let [{ id }] = await this.knex('user')
        .insert({
          username: input.username,
          password_hash: await hashPassword(input.password),
          avatar: input.avatar,
          email: input.email,
          tel: input.tel,
        })
        .returning('id')
      return { id }
    } catch (error) {
      let message = String(error)

      if (message.match(/username_unique/i))
        throw new HttpError(
          409,
          'this username is already taken by another user',
        )

      if (message.match(/email_unique/i))
        throw new HttpError(409, 'this email has already registered')

      if (message.match(/tel_unique/i))
        throw new HttpError(409, 'this tel has already registered')

      console.log('sql error:', message)
      throw error
    }
  }
}