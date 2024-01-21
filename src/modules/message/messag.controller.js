import { messageModel } from '../../../database/models/message.model.js'
import asyncError from '../../../utils/asyncError.js'
import httpStatusText from '../../../utils/httpStatusText.js'
import { AppError } from '../../../utils/appError.js'
import { userModel } from '../../../database/models/user.model.js'

const addMessage = asyncError(async (req, res, next) => {
  const { message, receivedId } = req.body
  const userExist = await userModel.findById(receivedId)
  if (!userExist) {
    return next(new AppError('User not found', 404))
  }
  if (userExist) {
    await messageModel.create({ message, receivedId, senderId: req.userId })
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      message: 'Message added successfully'
    })
    // next(new AppError("Internal Server Error", 401));
  } else {
    console.error('Error adding message:')
    return next(new AppError('User not found', 404))
  }
  console.log(receivedId)
})

const getUserMessages = asyncError(async (req, res, next) => {
  const messages = await messageModel.paginate({
    filter: { senderId: req.userId }
  })
  if (!messages) {
    next(new AppError('No message For U', 404))
  } else {
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      messages
    })
  }
  console.error('Error retrieving user messages:')

  next(new AppError('Internal Server Error', 401))
})

const updateMessage = asyncError(async (req, res, next) => {
  const { id } = req.params
  const { message } = req.body
  const newMsg = await messageModel.findOneAndUpdate(
    { _id: id, senderId: req.userId },
    { message },
    { new: true }
  )

  if (!newMsg) {
    return next(new AppError('Message not found', 404))
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { newMsg } })
})

const deleteMessage = asyncError(async (req, res, next) => {
  const { id } = req.params
  const newMsg = await messageModel.findByIdAndDelete({
    _id: id,
    senderId: req.userId
  })
  if (!newMsg) {
    return next(new AppError('Message not found', 404))
  }
  res.status(200).json({ message: 'deleted' })
})

export { addMessage, getUserMessages, updateMessage, deleteMessage }
