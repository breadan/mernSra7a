import jwt from "jsonwebtoken";
import { AppError } from "../../utils/appError.js";
import httpStatusText from "../../utils/httpStatusText.js";

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (e) {
      next(new AppError(httpStatusText.ERROR, "Internal Server Error", 401));
    }
  } else {
    next(new AppError(httpStatusText.ERROR, "no token provided", 401));
  }
};
export default verifyToken;
