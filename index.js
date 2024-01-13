import express from "express";
import cors from "cors";
import dotenv from "dotenv"; //secure 1
import userRouter from "./src/modules/user/user.routes.js";
import "./database/dbConnection/connection.js";
import messageRouter from "./src/modules/message/message.routes.js";
import { AppError, errorHandler } from "./utils/appError.js";

//secure 2
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use("/v1/messages", messageRouter);
// app.use(( err, req, res, next ) => {
//   res.locals.error = err;
//   if (err.status >= 100 && err.status < 600)
//     res.status(err.status);
//   else
//     res.status(500);
//   res.render('error');
// });
app.get("/", (req, res) => res.send(" World!"));

app.all("*", (req, res, next) => {
  next(new AppError(`This Resource Is Not Available ${req.originalUrl}`, 404));
});

app.use(errorHandler);

app.listen(5000, () => {
  console.log(`Example app listening on port ${5000}!`);
});
