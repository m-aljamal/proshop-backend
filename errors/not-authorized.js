const CustomError = require("./custom-error");

class NotAuthorizedError extends CustomError {
  constructor() {
    super("Not authorize to access this route");
    this.statusCode = 401;

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors() {
    return [{ message: "Not authorize to access this route" }];
  }
}
module.exports = NotAuthorizedError;
