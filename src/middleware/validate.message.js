const rules = {
  messageEmpty: (req, res, next) => {
    const message = req.body.message ? req.body.message.trim() : undefined;
    if (!message || message.length < 3 || message.length > 200) {
      next({
        name: "validation Error",
        element: "message : message",
        message: "Message is required. The message length must be between 3 and 200 characters.",
      });
    } else {
      next();
    }
  },

  idRules: (req, res, next) => {
    const receviedId = req.body;
    if (!receviedId) {
      next({
        name: "validation Error",
        element: "id : id",
        message: "id cannot be empty",
      });
    }
    next();
  }
};

const validate = {
  message: [rules.messageEmpty, rules.idRules],
};

export default validate;
