import express from 'express';
import { addMessage, getUserMessages } from '../../modules/message/messag.controller.js';
import validate from "../../middleware/validate.message.js";
import { auth } from '../../middleware/auth.js';

const messageRouter = express.Router();

messageRouter.post('/', [validate.message,auth], addMessage);
messageRouter.get('/', auth, getUserMessages);

export default messageRouter;
