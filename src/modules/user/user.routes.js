import express from "express";
import {
  getUser,
  getUsers,
  signIn,
  signUp,
  verify,
} from "../../modules/user/user.contrpller.js";
import validate from "../../middleware/validate.js";
import  middSignUp  from "../../middleware/checkEmail.js";
import { auth } from "../../middleware/auth.js";


const userRouter = express.Router();

userRouter.post("/v1/signUp", [validate.signUp, middSignUp], signUp);
userRouter.post("/v1/signIn",signIn);
userRouter.get("/v1/verify/:token", verify);
userRouter.get("/v1/users", getUsers);
userRouter.get("/v1/user/:id", getUser);

export default userRouter;
