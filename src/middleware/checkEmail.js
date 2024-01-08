import { userModel } from "../../database/models/user.model.js";
import httpStatusText from "../../utils/httpStatusText.js";

const middSignUp = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Email Already Exists",
    });
  }
  next();
};

export default middSignUp;
