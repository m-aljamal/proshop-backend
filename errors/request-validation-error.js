const CustomError = require("./custom-error");

class RequestValidationError extends CustomError {
  constructor(errors) {
    super("Invalid request parameters");
    this.errors = errors;
    this.statusCode = 400;
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}

module.exports = RequestValidationError;
