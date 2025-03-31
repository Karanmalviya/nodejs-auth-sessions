const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.status || 500;

  // if (err.code === "EBADCSRFTOKEN") {
  //   //csrf token error
  //   return res
  //     .status(statusCode)
  //     .json({ success: false, message: "Unauthorized request" });
  // }
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

module.exports = errorMiddleware;
