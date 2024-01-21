import express from 'express'
import {
  addMessage,
  deleteMessage,
  getUserMessages,
  updateMessage
} from '../../modules/message/messag.controller.js'
import validate from '../../middleware/validate.message.js'
import { auth } from '../../middleware/auth.js'
import { verifyUserAccess, verifyUserAndAdmin } from '../../middleware/verifyToken.js'

const messageRouter = express.Router()

messageRouter.post('/', [validate.message, auth, verifyUserAccess], addMessage)
messageRouter.get('/', [auth, verifyUserAccess], getUserMessages)
messageRouter.patch('/:id', [auth, verifyUserAccess], updateMessage)
messageRouter.delete('/:id', [auth, verifyUserAndAdmin], deleteMessage)

export default messageRouter
