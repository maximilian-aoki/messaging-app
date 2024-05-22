const asyncHandler = require("express-async-handler");

// const gravatar = require("gravatar");
// const newAvatar = gravatar.url(
//   "efverevev",
//   { s: 100, r: "g", d: "retro" },
//   true
// );
// console.log(newAvatar);

// home chats

// path:        "/"
// purpose:     "get all available chat rooms for an auth user, sorted by most recent convos"
// method:      GET
// auth:        true
// validation:  false
// redirect:    to "/log-in" on failed auth

exports.getUserChatRooms = [
  asyncHandler(async (req, res, next) => {
    res.send("get all authed user chat rooms");
  }),
];

// sign-up

// path:        "/sign-up"
// purpose:     "get sign-up page"
// method:      GET
// auth:        false
// validation:  false
// redirect:    false

exports.getSignUp = (req, res, next) => {
  res.send("get sign-up page");
};

// path:        "/sign-up"
// purpose:     "try to sign up"
// method:      POST
// auth:        false
// validation:  [username, email, password]
// redirect:    to "/log-in" on successful sign-up

exports.postSignUp = [
  asyncHandler(async (req, res, next) => {
    res.send("try to sign up");
  }),
];

// log-in

// path:        "/log-in"
// purpose:     "get log-in page"
// method:      GET
// auth:        false
// validation:  false

exports.getLogIn = (req, res, next) => {
  res.send("get log-in page");
};

// path:        "/log-in"
// purpose:     "try to log in with session cookie"
// method:      POST
// auth:        false
// validation:  [email, password]
// redirect:    to "/" if successful login

exports.postLogIn = [
  asyncHandler(async (req, res, next) => {
    res.send("try to log in");
  }),
];
