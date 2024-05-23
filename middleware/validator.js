const { body, validationResult, matchedData } = require("express-validator");

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
validator.validatePasswordSignup = body("password")
  .notEmpty()
  .withMessage("must provide password")
  .isLength({ min: 6 })
  .withMessage("password must be at least 6 chars long")
  .custom((value, { req }) => {
    return value === req.body.passwordConfirm;
  })
  .withMessage("password must match the 'confirm password' field")
  .escape();
validator.validatePasswordLogin = body("password")
  .notEmpty()
  .withMessage("must provide password")
  .isLength({ min: 6 })
  .withMessage("password must be at least 6 chars long")
  .escape();

// validator pipe middleware
validator.pipe = (validators, view, header, ...args) => {
  return async (req, res, next) => {
    for (let i = 0; i < validators.length; i += 1) {
      await validators[i].run(req);
    }

    // handle errors
    const validationErrs = validationResult(req);
    if (validationErrs.errors.length) {
      res.locals.errors = {};
      res.locals.postVals = {};

      const errorArray = validationErrs.errors.toReversed();
      errorArray.forEach((err) => {
        res.locals.errors[err.path] = err.msg;
      });

      args.forEach((property) => {
        res.locals.postVals[property] = req.body[property];
      });

      res.locals.header = header;
      return res.render(view);
    }

    // validation successful
    req.validatedData = matchedData(req);
    next();
  };
};
// export
module.exports = validator;
