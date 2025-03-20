const errorMiddleware = (err, req, res, next) => {
  console.log("err.stack", err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

module.exports = errorMiddleware;

// class ApiError extends Error {
//   constructor(statusCode, message, isOperational = true, stack = "") {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = isOperational;
//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }

// module.exports = ApiError;
