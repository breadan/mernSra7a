import express from "express";
import {
  getUser,
  getUsers,
  updateUser,
  signIn,
  signUp,
  verify,
  profilePhoto,
  deleteUserProfile,

} from "../../modules/user/user.contrpller.js";
import validate from "../../middleware/validate.js";
import middSignUp from "../../middleware/checkEmail.js";//
import { auth } from "../../middleware/auth.js";
import { verifyAdmen, verifyUserAndAdmin } from "../../middleware/verifyToken.js";
import { photoUpload } from "../../middleware/photoUpload.js";

const userRouter = express.Router();

userRouter.post("/v1/signUp", [validate.signUp], signUp, (err, data) => {
  if (err) {
    next(err)
  } else {
    res.send(data)
  }
});
userRouter.post("/v1/signIn", signIn);
userRouter.post("/v1/profile/:id", auth, photoUpload.single("image"), profilePhoto);
userRouter.get("/v1/verify/:token", verify);
userRouter.get("/v1/users", getUsers);
userRouter.get("/v1/user/:id", getUser);
// update user
userRouter.post("/v1/user/:id", [auth], updateUser);//verifyAdmen
userRouter.delete("/v1/user/:id", [auth, verifyUserAndAdmin], deleteUserProfile);

export default userRouter;
