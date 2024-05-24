const asyncHandler = require("express-async-handler");
const auth = require("../middleware/authenticator");
const { User } = require("../db/models/user");

// all users

// path:        "/users"
// purpose:     "get all available users for an auth user that DON'T already exist in their room"
// method:      GET
// auth:        true
// validation:  false
// redirect:    to "/log-in" on failed auth

exports.getAllUsers = [
  auth.authenticate,
  asyncHandler(async (req, res, next) => {
    const allAvailUsers = await User.find({
      _id: { $nin: [...req.user.friends, req.user._id] },
    })
      .sort({ username: 1 })
      .exec();

    res.render("addRoom", {
      header: "Add a New Chat",
      allAvailUsers,
    });
  }),
];

// path:        "/rooms/create"
// purpose:     "create a new chat room for two users"
// method:      POST
// auth:        true
// validation:  false
// redirect:    to "/log-in" on failed auth
// redirect:    to "/rooms:/:roomId" on successful creation

exports.createRoom = [
  auth.authenticate,
  asyncHandler(async (req, res, next) => {
    res.send("create new room");
  }),
];

// path:        "/rooms/:roomId"
// purpose:     "get a specific chat room, CONNECT SOCKET.IO and use it to get all messages"
// method:      GET
// auth:        true
// validation:  false
// redirect:    to "/log-in" on failed auth

exports.getRoom = [
  auth.authenticate,
  asyncHandler(async (req, res, next) => {
    res.render("room", {
      header: `Room ${req.params.roomId}`,
    });
  }),
];
