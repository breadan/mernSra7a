import { userModel } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import httpStatusText from "../../../utils/httpStatusText.js";
import jwt, { decode } from "jsonwebtoken";
import { sendEmail } from "../../../utils/email.js";
import asyncError from "../../../utils/asyncError.js";
import { AppError } from "../../../utils/appError.js";
import { dirname } from "path";
import * as path from "path";
import {
  cloudinaryRemove,
  cloudinaryUpload,
} from "../../../utils/cloudinary.js";
import fs from "fs";

const __dirname = dirname("../images");

//to have url
const logger = (req, res, next) => {
  console.log(req.url);
  next();
};

const signUp = asyncError(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (user) {
    next(new AppError("Email Already Exists", 409));
  } else {
    const { name, email, password, age } = req.body;

    const newUser = await userModel.create({ name, email, password, age });
    //mailer
    sendEmail({ email });

    return res
      .status(201)
      .json({ status: httpStatusText.SUCCESS, data: { newUser } });

    // console.error(error);
  }
});

export const verify = asyncError(async (req, res, next) => {
  const { token } = req.params;
  jwt.verify(token, process.env.JWT_SECRET2, async (err, decoded) => {
    if (err) return next(new AppError("Unauthorized", 401));
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
  const users = await userModel.find().select("-password");
  // It is not an error to return an em
  if (users) {
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { users } });
    console.error(error);
  } else {
    next(new AppError("Internal Server Error", 401));
  }
});

const getUser = asyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (user) {
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { user } });
  } else {
    next(new AppError("Internal Server Error", 401));
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
  next(new AppError("Internal Server Error", 401));
});

//upload profile photo

/**
 * 1- {Validation}
 * 2- Get the path to the image
 * 3- Upload to Cloudinary server
 * 4- Get the user from DB
 * 5- Delete the old profile photo if exist
 * 6- Change the profile photo field in the DB
 * 7- send response to clint
 * 8- remove image from the server
 */

const profilePhoto = asyncError(async (req, res) => {
  //1
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ message: "No File Selected" });
  }
  //2
  const imagePath = path.join(__dirname, `./images/${req.file.filename}`);
  //3 -in another folder
  //4
  const result = await cloudinaryUpload(imagePath);
  console.log(result);

  //
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "User not found",
    });
  }
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemove(user.profilePhoto.publicId);
  }
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();

  //7
  res.status(200).json({
    message: "Profile Photo Uploaded Successfully",
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });
  fs.unlinkSync(imagePath);
});

/*
#Desc: delete User Profile 
#Rout: /api/users/profile/:id
#Method: delete
#Access:  User himself or admin
*/
/**
 * 1- get userfrom DB
 * 2- git all posts from DB
 * 3- get the public ids from the posts
 * 4- delete all posts image from cloudinary
 * 5- delete profile picture from cloudinary
 * 6- delete user posts & comments
 * 7- delete the user himself
 * 8- send response
 */
const deleteUserProfile = asyncError(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "User not found",
    });
  }
  await cloudinaryRemove(user.profilePhoto.publicId);
  await userModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "User Deleted Successfully" });
});

export {
  signUp,
  signIn,
  getUsers,
  getUser,
  updateUser,
  profilePhoto,
  deleteUserProfile,
};
