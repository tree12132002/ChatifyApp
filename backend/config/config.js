import { ENV } from '../src/libs/env.js'

const requiredEnvVars = [
  'DB_DEV_USERNAME',
  'DB_DEV_PASSWORD',
  'DB_DEV_DATABASE',
  'DB_DEV_HOST'
]

const missingVars = requiredEnvVars.filter(v => !ENV[v])

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  )
}

export default {
  development: {
    username: ENV.DB_DEV_USERNAME,
    password: ENV.DB_DEV_PASSWORD,
    database: ENV.DB_DEV_DATABASE,
    host: ENV.DB_DEV_HOST,
    dialect: 'mysql'
  },
  test: {
    username: ENV.DB_TEST_USERNAME,
    password: ENV.DB_TEST_PASSWORD,
    database: ENV.DB_TEST_DATABASE,
    host: ENV.DB_TEST_HOST,
    dialect: 'mysql'
  },
  production: {
    username: ENV.DB_PROD_USERNAME,
    password: ENV.DB_PROD_PASSWORD,
    database: ENV.DB_PROD_DATABASE,
    host: ENV.DB_PROD_HOST,
    dialect: 'mysql'
  }
}
