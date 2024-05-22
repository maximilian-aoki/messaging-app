const { body } = require("express-validator");

const validator = {};

// user validators
validator.validateUsername = body("username")
  .trim()
  .notEmpty()
  .withMessage("must provide username")
  .isLength({ max: 20 })
  .withMessage("username cannot exceed 20 chars");
validator.validateEmail = body("email")
  .trim()
  .notEmpty()
  .withMessage("must provide email")
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  .withMessage("email must be in valid format");
validator.validatePassword = body("password")
  .notEmpty()
  .withMessage("must provide password")
  .custom((value, { req }) => {
    return value === req.body.passwordConfirm;
  })
  .withMessage("password must match the 'confirm password' field")
  .escape();

// validator pipe middleware
validator.pipe = (validators) => {
  return async (req, res, next) => {
    for (let i = 0; i < validators.length; i += 1) {
      await validators[i].run(req);
    }
    next();
  };
};
// export
module.exports = validator;
