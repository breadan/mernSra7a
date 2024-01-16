import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  let token = req.header("token");
  console.log(token);
  if (!token) {
    return res.status(401).json({
      status: "ERROR",
      message: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = decoded.user;
    if (!user) {
      return res.status(401).json({
        status: "ERROR",
        message: "User not found",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        status: "ERROR",
        message: "User not verified",
      });
    }

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
