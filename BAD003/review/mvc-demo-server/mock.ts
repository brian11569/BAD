import { Request, Response } from 'express'
import { Session } from 'express-session'

export function mockRequest() {
  let req = {} as Request
  req.body = {}
  req.params = {}
  req.query = {}
  req.session = {} as Session
  req.session.save = jest.fn()
  return req
}

export function mockResponse() {
  let res = {} as Response
  res.status = jest.fn()
  res.json = jest.fn()
  return res
}