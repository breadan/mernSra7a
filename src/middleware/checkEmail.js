import { userModel } from "../../database/models/user.model.js";
import httpStatusText from "../../utils/httpStatusText.js";
import { AppError } from "../../utils/appError.js";
import asyncError from "../../utils/asyncError.js";

const middSignUp =asyncError( async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (user) {
    // return res.status(400).json({
    //   status: httpStatusText.ERROR,
    //   message: "Email Already Exists",
    // });
    next(new AppError(httpStatusText.ERROR, "Email Already Exists", 400));
  }
  next();
});

export default middSignUp;
