import { NextFunction, Request, Response, Router } from 'express'
import { UserService } from './user.service'
import { HttpError } from './http.error'
import {
  ParseResult,
  Parser,
  ParserContext,
  email,
  object,
  optional,
  string,
} from 'cast.ts'
import {
  to_full_hk_mobile_phone,
  is_hk_mobile_phone,
} from '@beenotung/tslib/validate'
import './session'
import formidable, { Options } from 'formidable'
import { mkdirSync } from 'fs'
import { randomUUID } from 'crypto'
import { MultipartFormParser } from './MultipartFormParser'

function tel() {
  let stringParser = string({ trim: true })
  return {
    type: 'tel',
    sampleValue: '98765432',
    randomSample: () => '98765432',
    parse(input: unknown): string {
      let string = stringParser.parse(input)
      let tel = to_full_hk_mobile_phone(string).replace('+852', '')
      if (!tel) throw new HttpError(400, 'invalid tel')
      return tel
    },
  }
}

let uploadDir = 'uploads'
mkdirSync(uploadDir, { recursive: true })

// function tel() {
//   return new TelParser()
// }

// class TelParser implements Parser<string> {
//   type: string = 'tel'
//   sampleValue: string = '98765432'
//   randomSample(): string {
//     return '98765432'
//   }
//   parse(input: unknown, context?: ParserContext | undefined): string {
//     to_full_hk_mobile_phone(input)
//   }
// }

export class UserController {
  public router = Router()

  wrapMethod(method: (req: Request) => object | Promise<object>) {
    method = method.bind(this)
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        let json = await method(req)
        res.json(json)
      } catch (error) {
        next(error)
      }
    }
  }

  constructor(
    private userService: UserService,
    private registerFormParser: MultipartFormParser,
  ) {
    this.router.post('/user/login', this.wrapMethod(this.login))

    this.router.post('/user/register', this.wrapMethod(this.register_multipart))
    // this.router.post('/user/register', async (req, res, next) => {
    //   try {
    //     let json = await this.register_multipart(req)
    //     res.json(json)
    //   } catch (error) {
    //     next(error)
    //   }
    // })

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

  async register_json(req: Request) {
    // input.tel = input.tel.replace(/^\+852/, '')

    let registerParser = object({
      username: string({ minLength: 5, maxLength: 32 }),
      password: string({ minLength: 6, maxLength: 256, match: /[a-z0-9]/ }),
      email: email(),
      tel: tel(),
      // tel: string({
      //   trim: true,
      //   nonEmpty: true,
      //   match: /^[9687]{1}[0-9]{7}$/,
      // }),
    })

    let input = registerParser.parse(req.body)

    if (!input.password.match(/[0-9]/)) {
      throw new HttpError(
        400,
        'password is too easy be cracked, it should have at least 1 digits (0-9)',
      )
    }
    if (!input.password.match(/[a-z]/i)) {
      throw new HttpError(
        400,
        'password is too easy be cracked, it should have at least 1 english characters (a-z)',
      )
    }

    let json = await this.userService.register({
      // username: input.username,
      // password: input.password,
      // email: input.email,
      // tel: input.tel,
      ...input,
      avatar: null,
    })

    req.session.user = {
      id: json.id,
      username: input.username,
    }
    req.session.save()

    return json
  }

  static registerFormOptions: Options = {
    uploadDir,
    filter(part) {
      // console.log('filter:', part)
      return (
        (part.name == 'avatar' && part.mimetype?.startsWith('image/')) || false
      )
    },
    keepExtensions: true,
    filename(name, ext, part, form) {
      // console.log('filename:', { name, ext, part })
      return randomUUID() + ext
    },
  }

  async register_multipart(req: Request) {
    // input.tel = input.tel.replace(/^\+852/, '')

    let registerParser = object({
      fields: object({
        username: string({ minLength: 5, maxLength: 32 }),
        password: string({ minLength: 6, maxLength: 256 }),
        email: email(),
        tel: tel(),
      }),
      files: object({
        avatar: optional(
          object({
            newFilename: string(),
          }),
        ),
      }),
    })

    // console.log('this:', this)
    let formInput = await this.registerFormParser.parse(req)
    let input = registerParser.parse(formInput)

    if (!input.fields.password.match(/[0-9]/)) {
      throw new HttpError(
        400,
        'password is too easy be cracked, it should have at least 1 digits (0-9)',
      )
    }
    if (!input.fields.password.match(/[a-z]/i)) {
      throw new HttpError(
        400,
        'password is too easy be cracked, it should have at least 1 english characters (a-z)',
      )
    }

    let json = await this.userService.register({
      // username: input.fields.username,
      // password: input.fields.password,
      ...input.fields,
      avatar: input.files.avatar?.newFilename || null,
      // avatar: null,
    })

    req.session.user = {
      id: json.id,
      username: input.fields.username,
    }
    req.session.save()

    return json
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