import 'dotenv/config'

export const ENV = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_DEV_USERNAME: process.env.DB_DEV_USERNAME,
  DB_DEV_PASSWORD: process.env.DB_DEV_PASSWORD,
  DB_DEV_DATABASE: process.env.DB_DEV_DATABASE,
  DB_DEV_HOST: process.env.DB_DEV_HOST,
  DB_TEST_USERNAME: process.env.DB_TEST_USERNAME,
  DB_TEST_PASSWORD: process.env.DB_TEST_PASSWORD,
  DB_TEST_DATABASE: process.env.DB_TEST_DATABASE,
  DB_TEST_HOST: process.env.DB_TEST_HOST,
  DB_PROD_USERNAME: process.env.DB_PROD_USERNAME,
  DB_PROD_PASSWORD: process.env.DB_PROD_PASSWORD,
  DB_PROD_DATABASE: process.env.DB_PROD_DATABASE,
  DB_PROD_HOST: process.env.DB_PROD_HOST,
  JWT_SECRET: process.env.JWT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  CLIENT_URL: process.env.CLIENT_URL,
}
