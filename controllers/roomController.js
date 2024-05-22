const asyncHandler = require("express-async-handler");

// all users

// path:        "/users"
// purpose:     "get all available users for an auth user that DON'T already exist in their room"
// method:      GET
// auth:        true
// validation:  false
// redirect:    to "/log-in" on failed auth

exports.getAllUsers = [
  asyncHandler(async (req, res, next) => {
    res.send("get all authed user chat rooms");
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
  asyncHandler(async (req, res, next) => {
    res.send(`get room ${req.params.roomId}`);
  }),
];
