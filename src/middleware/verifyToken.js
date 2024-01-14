import jwt from "jsonwebtoken";
import { AppError } from "../../utils/appError.js";

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (e) {
      next(new AppError( "Internal Server Error", 401));
    }
  } else {
    next(new AppError( "no token provided", 401));
  }
};

//NOTE: Where already have another auth that verify the token so I removed the verify token from verifyAdmen
const verifyAdmen = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    next(new AppError( "you are not admin", 401));
  } else {
    next();
  }
};

const verifyUserAccess = (req, res, next) => {
  verifyToken (req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({
        Status: false,
        message: "Not Allowed, Only User can access His Profile",
      });
    }
  })
}
const verifyUserAndAdmin = (req, res, next) => {
  verifyToken (req, res, () => {
    if (req.user.id === req.params.id ||req.user.role !== "admin") {
      next();
    } else {
      return res.status(403).json({
        Status: false,
        message: "Not Allowed, Only User can access His Profile or Admin",
      });
    }
  })
}
export { verifyToken, verifyAdmen, verifyUserAndAdmin, verifyUserAccess };
