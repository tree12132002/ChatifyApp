import dotenv from 'dotenv'

dotenv.config()

const requiredEnvVars = [
  'DB_DEV_USERNAME',
  'DB_DEV_PASSWORD',
  'DB_DEV_DATABASE',
  'DB_DEV_HOST',
]

const missingVars = requiredEnvVars.filter((v) => !process.env[v])

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  )
}

export default {
  development: {
    username: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASSWORD,
    database: process.env.DB_DEV_DATABASE,
    host: process.env.DB_DEV_HOST,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
    host: process.env.DB_TEST_HOST,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_PROD_USERNAME,
    password: process.env.DB_PROD_PASSWORD,
    database: process.env.DB_PROD_DATABASE,
    host: process.env.DB_PROD_HOST,
    dialect: 'mysql',
  },
}
