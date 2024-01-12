import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  let token = req.header("token");

  if (!token) {
    return res.status(401).json({
      status: "ERROR",
      message: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = decoded.user;
    if (!user || !user.verified) {
      return res.status(401).json({
        status: "ERROR",
        message: "User not found",
      });
    }
<<<<<<< HEAD
    
=======
    // if (!user.verified) {
    //   return res.status(403).json({
    //     status: "ERROR",
    //     message: "User not verified",
    //   });
    // }
>>>>>>> f2e42d1018dfe3996e4800a118cf308650509295

    req.userId = user._id;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "ERROR",
      message: err.message,
    });
  }
};
