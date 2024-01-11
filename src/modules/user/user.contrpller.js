import { userModel } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import httpStatusText from "../../../utils/httpStatusText.js";
import jwt, { decode } from "jsonwebtoken";
import { sendEmail } from "../../../utils/email.js";
import asyncHandler from "express-async-handler";
import asyncError from "../../../utils/asyncError.js";
import { AppError } from "../../../utils/appError.js";
//to have url
const logger = (req, res, next) => {
  console.log(req.url);
  next();
};

const signUp = asyncError(async (req, res, next) => {
  const { name, email, password, age } = req.body;

  const newUser = await userModel.create({ name, email, password, age });
  //mailer
  sendEmail({ email });
  res.status(201).json({ status: httpStatusText.SUCCESS, data: { newUser } });

  console.error(error);

  next(new AppError(httpStatusText.ERROR, "Internal Server Error", 401));
});

export const verify = asyncError(async (req, res, next) => {
  const { token } = req.params;
  jwt.verify(token, process.env.JWT_SECRET2, async (err, decoded) => {
    if (err) return next(new AppError(401, "Unauthorized"));
    await userModel.findOneAndUpdate(
      { email: decoded.email },
      { verified: true }
    );
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "Email Verified! Controller",
    });
  });
});

const signIn = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });

  if (!user || !bcrypt.compareSync(password, user.password) || !user.verified) {
    return next(new AppError("Unauthorized", 401));
  } else {
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "Login Successful",
      token,
    });
  }
});

const getUsers = asyncError(async (req, res, next) => {
  const users = await userModel.find();
  // It is not an error to return an em
  // if (users) {
  //   res.status(200).json({ status: httpStatusText.SUCCESS, data: { users } });
  //   console.error(error);
  // } else {
  //   next(new AppError(httpStatusText.ERROR, "Internal Server Error", 401));
  // }
});

const getUser = asyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (user) {
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { user } });
  } else {
    next(new AppError(httpStatusText.ERROR, "Internal Server Error", 401));
  }
});

const updateUser = asyncError(async (req, res, next) => {
  //TODO: update user
  const { id } = req.params;
  const { name, email, password, age } = req.body;
  const user = await userModel.findByIdAndUpdate(
    id,
    { name, email, password, age },
    { new: true }
  );
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { user } });
  next(new AppError(httpStatusText.ERROR, "Internal Server Error", 401));
});

export { signUp, signIn, getUsers, getUser, updateUser };
