// handle error in project (3)

const asyncError = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// const asyncError = (fn) => (req, res, next) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((err) => {
//       next(err);
//     });
//   };
// };

export default asyncError
