// handle error in project (2)

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
// Note: Added missing parameters so the function signature matches the express error handling middleware signature.
export const errorHandler = (err, req, res, next) => {
  console.log("🚀 ~ errorHandler ~ err:", err);
  let { statusCode, message } = err;

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    // ...{ stack: err.stack },
  };

  console.error(err);

  res.status(statusCode).send(response);
};
