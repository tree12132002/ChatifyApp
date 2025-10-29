import express from 'express'
import {
  signup,
  login,
  logout,
  updateProfile
} from '../controllers/auth.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { arcjectProtection } from '../middlewares/arcjet.middleware.js'

const router = express.Router()

router.use(arcjectProtection)

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.put('/update-profile', protectRoute, updateProfile)
router.get('/check-auth', protectRoute, (req, res) =>
  res.status(200).json(req.user)
)

export default router
