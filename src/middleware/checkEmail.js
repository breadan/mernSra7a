import { userModel } from "../../database/models/user.model.js";
import httpStatusText from "../../utils/httpStatusText.js";
import { AppError } from "../../utils/appError.js";
import asyncError from "../../utils/asyncError.js";

const middSignUp = asyncError(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (user) {
    // return res.status(400).json({
    //   status: httpStatusText.ERROR,
    //   message: "Email Already Exists",
    // });
    // changed status code to 409
    next(new AppError(409, "Email Already Exists"));
  }
  next();
});

export default middSignUp;
