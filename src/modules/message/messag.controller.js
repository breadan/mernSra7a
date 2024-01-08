import { messageModel } from "../../../database/models/message.model.js";
import httpStatusText from "../../../utils/httpStatusText.js";

const addMessage = async (req, res) => {
  try {
    const { message, receivedId } = req.body;
    await messageModel.create({ message, receivedId, senderId: req.userId });
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      message: "Message added successfully",
    });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Failed to add message",
    });
  }
};

const getUserMessages = async (req, res) => {
  try {
    const messages = await messageModel.find({ senderId: req.userId });

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      messages,
    });
  } catch (error) {
    console.error("Error retrieving user messages:", error);
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Failed to retrieve user messages",
    });
  }
};

export { addMessage, getUserMessages };

// const getUserMs = async (req, res) => {
//   const { receviedId } = req.body;
//   const message = await messageModel.find({ receviedId });

//   //pagination
//   const itemPrePagge = 3;
//   const requestedPage = req.query.page -1 || 0;
//   const startIndex = requestedPage * itemPrePagge;
//   const endIndex = itemPrePagge * startIndex;
//   const paginatedMsg = message.filter((message, index) => index >= startIndex && index < endIndex);
