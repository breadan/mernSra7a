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
  next(new AppError(httpStatusText.ERROR, "Internal Server Error", 401));
});

const getUserMessages = asyncError(async (req, res, next) => {
  const messages = await messageModel.paginate({
    filter: { senderId: req.userId },
  })
  // .populate("user");

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    messages,
  });
  console.error("Error retrieving user messages:", error);

  next(new AppError(httpStatusText.ERROR, "Internal Server Error", 401));
});

const updateMessage = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const { user, message } = req.body;
  const {senderId} = await messageModel.findById(id);
  if(req.userId !== senderId) throw new AppError("this message Not found", 401);

  const newMsg = await messageModel.findOneAndUpdate(
    { _id: id, user },
    { message },
    { new: true }
  );
  if (!newMsg) {
    next(new AppError(httpStatusText.ERROR, "Internal Server Error", 401));
  }
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { newMsg } });
});

export { addMessage, getUserMessages, updateMessage };

// const getUserMs = async (req, res) => {
//   const { receviedId } = req.body;
//   const message = await messageModel.find({ receviedId });

//   //pagination
//   const itemPrePagge = 3;
//   const requestedPage = req.query.page -1 || 0;
//   const startIndex = requestedPage * itemPrePagge;
//   const endIndex = itemPrePagge * startIndex;
//   const paginatedMsg = message.filter((message, index) => index >= startIndex && index < endIndex);
