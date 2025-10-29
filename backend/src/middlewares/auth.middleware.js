import jwt from 'jsonwebtoken'
import { ENV } from '../libs/env.js'
import db from '../../models/index.js'

const { User } = db

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token)
      return res
        .status(401)
        .json({ message: 'Unauthorized - No token provided' })

    const decoded = jwt.verify(token, ENV.JWT_SECRET)

    if (!decoded)
      return res.status(401).json({ message: 'Unauthorized - Invalid token' })

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    })

    if (!user) return res.status(404).json({ message: 'User not found' })

    req.user = user
    next()
  } catch (error) {
    console.error('Error in protectRoute middleware: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
