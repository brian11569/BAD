import { NextFunction, Request, Response } from 'express'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserServiceMock } from './user.service.mock'
import { Session } from 'express-session'
import { mockRequest, mockResponse } from './mock'

let userController: UserController

let userService: UserService
let loginSpy: jest.SpyInstance
let registerSpy: jest.SpyInstance

let req: Request
let res: Response
let next: NextFunction

beforeEach(() => {
  userService = new UserServiceMock()
  loginSpy = jest.spyOn(userService, 'login')
  registerSpy = jest.spyOn(userService, 'register')

  userController = new UserController(userService)

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