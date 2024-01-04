import { env } from './env'
import Knex from 'knex'

let config = require('./knexfile')
let profile = config[env.NODE_ENV]

export let knex = Knex(profile)