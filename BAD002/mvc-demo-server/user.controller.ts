import { NextFunction, Request, Response, Router } from 'express'
import { UserService } from './user.service'
import { HttpError } from './http.error'
import './session'

export class UserController {
  public router = Router()

  wrapMethod(method: (req: Request) => object | Promise<object>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        let json = await method(req)
        res.json(json)
      } catch (error) {
        next(error)
      }
    }
  }

  constructor(private userService: UserService) {
    this.router.post('/user/login', this.wrapMethod(this.login))
    this.router.post('/user/register', async (req, res, next) => {
      try {
        let json = await this.register(req)
        res.json(json)
      } catch (error) {
        next(error)
      }
    })
    this.router.get('/user/session', async (req, res, next) => {
      try {
        let json = await this.getSession(req)
        res.json(json)
      } catch (error) {
        next(error)
      }
    })
    this.router.get('/user/:id/profile', this.wrapMethod(this.getPublicProfile))
  }

  async login(req: Request) {
    let { username, password } = req.body

    let missingFields: string[] = []

    if (!username) {
      missingFields.push('username')
      // throw new HttpError(400, 'missing username')
    } else {
      if (typeof username !== 'string')
        throw new HttpError(400, 'invalid username, expect string')
      if (username.length < 5) {
        throw new HttpError(
          400,
          'username too short, it should have at least 5 characters',
        )
      }
      if (username.length > 32) {
        throw new HttpError(
          400,
          'username too long, it should have at most 32 characters',
        )
      }
    }

    if (!password) {
      missingFields.push('password')
      // throw new HttpError(400, 'missing password')
    } else {
      if (typeof password !== 'string')
        throw new HttpError(400, 'invalid password, expect string')
      if (password.length < 6) {
        throw new HttpError(
          400,
          'password too short, it should have at least 6 characters',
        )
      }
      if (password.length > 256) {
        throw new HttpError(
          400,
          'password too long, it should have at most 256 characters',
        )
      }
      if (!password.match(/[0-9]/)) {
        throw new HttpError(
          400,
          'password is too easy be cracked, it should have at least 1 digits (0-9)',
        )
      }
      if (!password.match(/[a-z]/i)) {
        throw new HttpError(
          400,
          'password is too easy be cracked, it should have at least 1 english characters (a-z)',
        )
      }
    }

    if (missingFields.length > 0) {
      throw new HttpError(400, 'missing ' + missingFields.join(', '))
    }

    let json = await this.userService.login({ username, password })

    req.session.user = {
      id: json.id,
      username,
    }
    req.session.save()

    return json
  }

  async register(req: Request) {
    throw new HttpError(501, 'not implemented')
  }

  async getSession(req: Request) {
    if (!req.session.user)
      throw new HttpError(401, 'this API is only for authenticated users')
    return {
      user: req.session.user,
    }
  }

  async getPublicProfile(req: Request) {
    throw new HttpError(501, 'not implemented')
  }
}