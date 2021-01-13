const BadRequestError = require("../errors/bad-request-error");

const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new BadRequestError(
        `User role ${req.user.role} is unauthorized to access `
      );
    next();
  };
};

module.exports = isAdmin;
