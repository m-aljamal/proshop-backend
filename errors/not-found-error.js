const CustomError = require("./custom-error");
class NotFoundError extends CustomError {
  constructor() {
    super("Invalid request parameters");
    this.statusCode = 404;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [{ message: "Invalid request parameters" }];
  }
}
module.exports = NotFoundError;
