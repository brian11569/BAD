import pg from 'pg'
import { env } from './env'

export let client = new pg.Client({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
})

client.connect()