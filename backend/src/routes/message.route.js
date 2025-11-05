import express from 'express'

import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage
} from '../controllers/message.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { arcjectProtection } from '../middlewares/arcjet.middleware.js'

const router = express.Router()

// the middlewares execute in order - so requests get rate-limited first, then authenticated
// this is actually more efficient since unauthenticated requests get blocked by rating limiting before hitting the auth middleware
router.use(arcjectProtection, protectRoute)

router.post('/contacts', getAllContacts)
router.post('/chats', getChatPartners)
router.get('/:id', getMessagesByUserId)
router.post('/send/:id', sendMessage)

export default router
