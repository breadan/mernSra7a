// handle error in project (2)

export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorHandler = (err, res) => {
  let { statusCode, message } = err;

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...{ stack: err.stack },
  };

  logger.error(err);

  res.status(statusCode).send(response);
};
