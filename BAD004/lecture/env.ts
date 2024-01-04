import { config } from 'dotenv'
import populateEnv from 'populate-env'

config()

export let env = {
  DB_NAME: '',
  DB_USER: '',
  DB_PASSWORD: '',
  NODE_ENV: 'development',
}

populateEnv(env, { mode: 'halt' })