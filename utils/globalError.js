export const globalError = (err, req, res, next) => {
  // console.error(err.stack)
  process.env.NODE_ENV == 'dev'
    ? res.status(err.statusCode).json({ err: err.message, stack: err.stack })
    : res.status(err.statusCode).json({ err: err.message });
};
//if you write return u must call it in index: globalError()
