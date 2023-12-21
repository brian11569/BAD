import express, { ErrorRequestHandler } from 'express'
import { print } from 'listening-on'
import { sessionMiddleware } from './session'
import { HttpError } from './http.error'
import { userRoutes } from './user.routes'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { client } from './db'
import { UserServiceImpl } from './user.service.impl'

let app = express()

app.use(sessionMiddleware)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use(userRoutes)

let userService = new UserServiceImpl(client)

app.use(new UserController(userService).router)

app.use((req, res, next) =>
  next(
    new HttpError(
      404,
      `route not found, method: ${req.method}, url: ${req.url}`,
    ),
  ),
)

let errorHandler: ErrorRequestHandler = (err: HttpError, req, res, next) => {
  if (!err.statusCode) console.error(err)
  res.status(err.statusCode || 500)
  let error = String(err).replace(/^(\w*)Error: /, '')
  if (req.headers.accept?.includes('application/json')) {
    res.json({ error })
  } else {
    res.end(error)
  }
}
app.use(errorHandler)

let port = 8100
app.listen(port, () => {
  print(port)
})