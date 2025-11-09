import jwt from 'jsonwebtoken'
import db from '../../models/index.js'
import { ENV } from '../libs/env.js'

const { User } = db

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // extract token from http-only cookies
    const token = socket.handshake.headers.cookie
      ?.split('; ')
      .find(row => row.startsWith('jwt='))
      ?.split('=')[1]

    if (!token) {
      console.log('Socket connection rejected: No token provided')
      return next(new Error('Unauthorized - No Token Provided'))
    }

    // verify the token
    const decoded = jwt.verify(token, ENV.JWT_SECRET)

    if (!decoded) {
      console.log('Socket connection rejected: Invalid token')
      return next(new Error('Unauthorized - Invalid Token'))
    }

    // find the user from db
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    })

    if (!user) {
      console.log('Socket connection rejected: User not found')
      return next(new Error('User not found'))
    }

    // attach user info to socket
    socket.user = user
    socket.userId = user.id.toString()

    console.log(`Socket authenticated for user: ${user.fullName} (${user.id})`)

    next()
  } catch (error) {
    console.error('Error in socket authentication: ', error.message)
    next(new Error('Unauthorized - Authentication failed'))
  }
}
