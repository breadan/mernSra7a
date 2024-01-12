import { messageModel } from "../../../database/models/message.model.js";
import asyncError from "../../../utils/asyncError.js";
import httpStatusText from "../../../utils/httpStatusText.js";
import { AppError } from "../../../utils/appError.js";

const addMessage = asyncError(async (req, res, next) => {
  const { message, receivedId } = req.body;
  await messageModel.create({ message, receivedId, senderId: req.userId });
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Message added successfully",
  });
  console.error("Error adding message:", error);
  next(new AppError("Internal Server Error", 401));
});

const getUserMessages = asyncError(async (req, res, next) => {
  const messages = await messageModel.paginate({
    filter: { senderId: req.userId },
  });
  if (!req.body.message) {
    next(new AppError("No message For Yoy", 404));
  } else {
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      messages,
    });
  }
  console.error("Error retrieving user messages:", error);

  next(new AppError("Internal Server Error", 401));
});

const updateMessage = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;
  const newMsg = await messageModel.findOneAndUpdate(
    { _id: id, senderId: req.userId },
    { message },
    { new: true }
  );

  if (!newMsg) {
    return next(new AppError("Message not found", 404));
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { newMsg } });
});

const deleteMessage = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;
  const newMsg = await messageModel.findByIdAndDelete({
    _id: id,
    senderId: req.userId,
  });
  if (!newMsg) {
    return next(new AppError("Message not found", 404));
  }
  res.status(200).json({ message: "deleted" });
});

export { addMessage, getUserMessages, updateMessage, deleteMessage };
