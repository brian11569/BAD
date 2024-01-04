import { NextFunction, Request, Response } from 'express'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserServiceMock } from './user.service.mock'
import { Session } from 'express-session'
import { mockRequest, mockResponse } from './mock'
import { MultipartFormParser } from './MultipartFormParser'

let userController: UserController

let userService: UserService
let loginSpy: jest.SpyInstance
let registerSpy: jest.SpyInstance

let registerFormParser: MultipartFormParser
let parseFormSpy: jest.SpyInstance

let req: Request
let res: Response
let next: NextFunction

beforeEach(() => {
  userService = new UserServiceMock()
  loginSpy = jest.spyOn(userService, 'login')
  registerSpy = jest.spyOn(userService, 'register')

  let parse = jest.fn()
  registerFormParser = {
    parse,
  }
  parseFormSpy = parse

  userController = new UserController(userService, registerFormParser)

  req = mockRequest()
  res = mockResponse()
  next = jest.fn()
})

/**
 * user login/register requires username, password.
 *
 * username should not be shorter than 5 characters.
 * username should not be longer than 32 characters.
 *
 * password should not be shorter than 6 characters.
 * password should not be longer than 256 characters.
 *
 * password should be hard to be cracked:
 * - require at least 1 digits (0-9)
 * - require at least 1 english characters (a-z)
 */

describe('login API endpoint', () => {
  let validUsername = 'admin'
  let validPassword = 'secret123'

  test('login() should requires username, password', async () => {
    req.body = {}

    await expect(userController.login(req)).rejects.toThrow(
      /missing.*username/i,
    )
    expect(userService.login).not.toHaveBeenCalled()

    await expect(userController.login(req)).rejects.toThrow(
      /missing.*password/i,
    )
    expect(userService.login).not.toHaveBeenCalled()

    req.body = {
      username: validUsername,
    }
    await expect(userController.login(req)).rejects.not.toThrow(
      /missing.*username/i,
    )
    expect(userService.login).not.toHaveBeenCalled()
    await expect(userController.login(req)).rejects.toThrow(
      /missing.*password/i,
    )
    expect(userService.login).not.toHaveBeenCalled()

    req.body = {
      password: validPassword,
    }
    await expect(userController.login(req)).rejects.toThrow(
      /missing.*username/i,
    )
    expect(userService.login).not.toHaveBeenCalled()
    await expect(userController.login(req)).rejects.not.toThrow(
      /missing.*password/i,
    )
    expect(userService.login).not.toHaveBeenCalled()
  })

  test('login() should requires username to have length between 5 and 32', async () => {
    req.body = {
      username: 'dave',
      password: validPassword,
    }

    await expect(() => userController.login(req)).rejects.toThrow(
      /username.*at least 5 characters/i,
    )
    expect(userService.login).not.toHaveBeenCalled()

    req.body = {
      username: 'x'.repeat(33),
      password: validPassword,
    }
    await expect(() => userController.login(req)).rejects.toThrow(
      /username.*at most 32 characters/i,
    )
    expect(userService.login).not.toHaveBeenCalled()
  })

  test('login() should requires password to have length between 6 and 256', async () => {
    req.body = {
      username: validUsername,
      password: '123ab',
    }

    await expect(userController.login(req)).rejects.toThrow(
      /password.*at least 6 characters/i,
    )
    expect(userService.login).not.toHaveBeenCalled()

    req.body = {
      username: validUsername,
      password: '123abc' + 'x'.repeat(256 - 6 + 1),
    }
    await expect(userController.login(req)).rejects.toThrow(
      /password.*at most 256 characters/i,
    )
    expect(userService.login).not.toHaveBeenCalled()
  })

  test('login() should requires password to have at least 1 digits (0-9)', async () => {
    req.body = {
      username: validUsername,
      password: 'apple pie',
    }

    await expect(userController.login(req)).rejects.toThrow(
      /password.*at least 1 digits \(0-9\)/i,
    )
    expect(userService.login).not.toHaveBeenCalled()
  })

  test('login() should requires password to have at least 1 english characters (a-z)', async () => {
    req.body = {
      username: validUsername,
      password: '123456',
    }

    await expect(userController.login(req)).rejects.toThrow(
      /password.*at least 1 english characters \(a-z\)/i,
    )
    expect(userService.login).not.toHaveBeenCalled()
  })

  test('login() should pass to userService.login when the input is valid', async () => {
    req.body = {
      username: validUsername,
      password: validPassword,
    }

    let id = Math.random()
    loginSpy.mockResolvedValue({ id })
    await expect(userController.login(req)).resolves.toEqual({ id })
    expect(userService.login).toHaveBeenCalledWith(req.body)
  })

  test('login() should save the user into session when login success', async () => {
    req.body = {
      username: validUsername,
      password: validPassword,
    }

    let id = Math.random()
    loginSpy.mockResolvedValue({ id })
    await expect(userController.login(req)).resolves.toBeDefined()
    expect(req.session.user).toEqual({ id, username: validUsername })
    expect(req.session.save).toHaveBeenCalled()
  })
})

describe('register_json API endpoint', () => {
  let validBody = {
    username: 'alice',
    password: 'secret123456',
    email: 'alice@gmail.com',
    tel: '98765432',
    avatar: null,
  }

  describe('missing/invalid input cases', () => {
    afterEach(() => {
      expect(userService.register).not.toHaveBeenCalled()
    })

    describe('missing field cases', () => {
      it('should require username', async () => {
        let { username, ...body } = validBody
        req.body = body

        await expect(userController.register_json(req)).rejects.toThrow(
          /missing.*username/,
        )
      })

      it('should require password', async () => {
        let { password, ...body } = validBody
        req.body = body

        await expect(userController.register_json(req)).rejects.toThrow(
          /missing.*password/,
        )
      })

      it('should require email', async () => {
        let { email, ...body } = validBody
        req.body = body

        await expect(userController.register_json(req)).rejects.toThrow(
          /missing.*email/,
        )
      })

      it('should require tel', async () => {
        let { tel, ...body } = validBody
        req.body = body

        await expect(userController.register_json(req)).rejects.toThrow(
          /missing.*tel/,
        )
      })
    })

    describe('invalid input cases', () => {
      it('should reject invalid email', async () => {
        req.body = { ...validBody, email: 'alice' }
        await expect(userController.register_json(req)).rejects.toThrow(
          /invalid.*email/i,
        )
      })

      it('should reject residential phone number', async () => {
        req.body = { ...validBody, tel: '23456789' }
        await expect(userController.register_json(req)).rejects.toThrow(
          /invalid.*tel/i,
        )
      })

      it('should reject non-HK tel', async () => {
        req.body = { ...validBody, tel: '123423456789' }
        await expect(userController.register_json(req)).rejects.toThrow(
          /invalid.*tel/i,
        )
      })
    })
  })

  describe('hk tel parsing', () => {
    it('should auto remove +852 prefix (not error)', async () => {
      req.body = { ...validBody, tel: '+85298765432' }
      let id = Math.random()
      registerSpy.mockResolvedValue({ id })
      await expect(userController.register_json(req)).resolves.toEqual({ id })
    })
  })

  test('register() should save the user into session when register success', async () => {
    req.body = {
      ...validBody,
    }

    let id = Math.random()
    registerSpy.mockResolvedValue({ id })
    await expect(userController.register_json(req)).resolves.toBeDefined()
    expect(req.session.user).toEqual({ id, username: validBody.username })
    expect(req.session.save).toHaveBeenCalled()
  })
})

describe('register_multipart API endpoint', () => {
  let validBody = {
    username: 'alice',
    password: 'secret123456',
    email: 'alice@gmail.com',
    tel: '98765432',
    avatar: null,
  }

  describe('missing/invalid input cases', () => {
    afterEach(() => {
      expect(userService.register).not.toHaveBeenCalled()
    })

    describe('missing field cases', () => {
      it('should require username', async () => {
        let { username, ...body } = validBody
        parseFormSpy.mockReturnValue({ fields: body, files: {} })

        await expect(userController.register_multipart(req)).rejects.toThrow(
          /missing.*username/,
        )
      })

      it('should require password', async () => {
        let { password, ...body } = validBody
        parseFormSpy.mockReturnValue({ fields: body, files: {} })

        await expect(userController.register_multipart(req)).rejects.toThrow(
          /missing.*password/,
        )
      })

      it('should require email', async () => {
        let { email, ...body } = validBody
        parseFormSpy.mockReturnValue({ fields: body, files: {} })

        await expect(userController.register_multipart(req)).rejects.toThrow(
          /missing.*email/,
        )
      })

      it('should require tel', async () => {
        let { tel, ...body } = validBody
        parseFormSpy.mockReturnValue({ fields: body, files: {} })

        await expect(userController.register_multipart(req)).rejects.toThrow(
          /missing.*tel/,
        )
      })
    })

    describe('invalid input cases', () => {
      it('should reject invalid email', async () => {
        let body = { ...validBody, email: 'alice' }
        parseFormSpy.mockReturnValue({ fields: body, files: {} })
        await expect(userController.register_multipart(req)).rejects.toThrow(
          /invalid.*email/i,
        )
      })

      it('should reject residential phone number', async () => {
        let body = { ...validBody, tel: '23456789' }
        parseFormSpy.mockReturnValue({ fields: body, files: {} })
        await expect(userController.register_multipart(req)).rejects.toThrow(
          /invalid.*tel/i,
        )
      })

      it('should reject non-HK tel', async () => {
        let body = { ...validBody, tel: '123423456789' }
        parseFormSpy.mockReturnValue({ fields: body, files: {} })
        await expect(userController.register_multipart(req)).rejects.toThrow(
          /invalid.*tel/i,
        )
      })
    })
  })

  describe('hk tel parsing', () => {
    it('should auto remove +852 prefix (not error)', async () => {
      let body = { ...validBody, tel: '+85298765432' }
      parseFormSpy.mockReturnValue({ fields: body, files: {} })
      let id = Math.random()
      registerSpy.mockResolvedValue({ id })
      await expect(userController.register_multipart(req)).resolves.toEqual({
        id,
      })
    })
  })

  describe('file upload', () => {
    it('should pass avatar filename to service method', async () => {
      parseFormSpy.mockReturnValue({
        fields: { ...validBody },
        files: {
          avatar: {
            newFilename: 'alice.jpg',
          },
        },
      })

      let id = Math.random()
      registerSpy.mockResolvedValue({ id })
      await userController.register_multipart(req)

      expect(userService.register).toHaveBeenCalledWith({
        ...validBody,
        avatar: 'alice.jpg',
      })
    })
  })

  test('register() should save the user into session when register success', async () => {
    parseFormSpy.mockReturnValue({
      fields: { ...validBody },
      files: {
        avatar: {
          newFilename: 'alice.jpg',
        },
      },
    })

    let id = Math.random()
    registerSpy.mockResolvedValue({ id })
    await expect(userController.register_multipart(req)).resolves.toBeDefined()
    expect(req.session.user).toEqual({ id, username: validBody.username })
    expect(req.session.save).toHaveBeenCalled()
  })
})