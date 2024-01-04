import { Router } from 'express'
import { knex } from './db'
import { HttpError } from './http.error'
import { comparePassword, hashPassword } from './hash'

export let userRoutes = Router()

userRoutes.post('/user/login', async (req, res, next) => {
  try {
    let result = await knex.raw(
      'select id, password_hash from "user" where username = $1',
      [req.body.username],
    )
    let user = result.rows[0]
    if (!user) throw new HttpError(404, 'user not found')
    let is_matched = await comparePassword({
      password: req.body.password,
      password_hash: user.password_hash,
    })
    if (!is_matched) throw new HttpError(401, 'wrong username or password')
    req.session.user = {
      id: user.id,
      username: req.body.username,
    }
    req.session.save()
    res.json({ id: user.id })
  } catch (error) {
    next(error)
  }
})

userRoutes.post('/user/register', async (req, res, next) => {
  try {
    // let password_hash = await hashPassword(req.body.password)
    let result = await knex.raw(
      'insert into "user" (username, password_hash) values ($1,$2) returning id',
      [req.body.username, req.body.password],
    )
    let id = result.rows[0].id
    req.session.user = {
      id,
      username: req.body.username,
    }
    req.session.save()
    res.json({ id })
  } catch (error) {
    next(error)
  }
})

userRoutes.get('/user/session', (req, res) => {
  if (!req.session.user) {
    res.status(401)
    res.json({ error: 'this API is only for authenticated users' })
    return
  }
  res.json({
    user: req.session.user,
  })
})

userRoutes.get('/user/:id/profile', (req, res) => {})