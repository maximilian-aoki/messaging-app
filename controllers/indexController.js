const asyncHandler = require("express-async-handler");
const auth = require("../middleware/authenticator");
const val = require("../middleware/validator");
const passport = require("../passport");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { User } = require("../db/models/user");

// home chats

// path:        "/"
// purpose:     "get all available chat rooms for an auth user, sorted by most recent convos"
// method:      GET
// auth:        true
// validation:  false
// redirect:    to "/log-in" on failed auth

exports.getUserChatRooms = [
  auth.authenticate,
  asyncHandler(async (req, res, next) => {
    res.render("home", {
      header: "Your Chats",
    });
  }),
];

// log-out

// path:        "/log-out"
// purpose:     "log out, end session"
// method:      GET
// auth:        true
// validation:  false
// redirect:    to "/log-in" on failed auth

exports.logOut = [
  auth.authenticate,
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
      }
      res.redirect("/log-in");
    });
  },
];

// sign-up

// path:        "/sign-up"
// purpose:     "get sign-up page"
// method:      GET
// auth:        false
// validation:  false
// redirect:    false

exports.getSignUp = (req, res, next) => {
  res.render("signup", {
    header: "Sign Up",
  });
};

// path:        "/sign-up"
// purpose:     "try to sign up"
// method:      POST
// auth:        false
// validation:  [username, email, password]
// redirect:    to "/log-in" on successful sign-up

exports.postSignUp = [
  val.pipe(
    [val.validateUsername, val.validateEmail, val.validatePasswordSignup],
    "signup", // view template
    "Sign Up", // header
    "username", // args
    "email",
    "password",
    "passwordConfirm"
  ),
  asyncHandler(async (req, res, next) => {
    const usernameExists = await User.find({
      username: req.validatedData.username,
    }).exec();
    if (usernameExists.length) {
      return res.render("signup", {
        header: "Sign Up",
        errors: {
          username: "username already exists",
        },
        postVals: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm,
        },
      });
    }

    const emailExists = await User.find({
      email: req.validatedData.email,
    }).exec();
    if (emailExists.length) {
      return res.render("signup", {
        header: "Sign Up",
        errors: {
          email: "email already exists",
        },
        postVals: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(req.validatedData.password, 10);
    const newAvatar = gravatar.url(
      req.validatedData.email,
      { s: 100, r: "g", d: "retro" },
      true
    );

    await User.create({
      username: req.validatedData.username,
      email: req.validatedData.email,
      password: hashedPassword,
      avatar: newAvatar,
      friends: [],
    });

    res.redirect("/log-in");
  }),
];

// log-in

// path:        "/log-in"
// purpose:     "get log-in page"
// method:      GET
// auth:        false
// validation:  false

exports.getLogIn = (req, res, next) => {
  res.render("login", {
    header: "Log In",
    error: req.flash("error"),
  });
};

// path:        "/log-in"
// purpose:     "try to log in with session cookie"
// method:      POST
// auth:        false
// validation:  [email, password]
// redirect:    to "/" if successful login

exports.postLogIn = [
  val.pipe(
    [val.validateEmail, val.validatePasswordLogin],
    "login", // view template
    "Log In", // header
    "email", // args
    "password"
  ),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true,
  }),
];
