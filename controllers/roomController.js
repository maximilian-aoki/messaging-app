const asyncHandler = require("express-async-handler");
const auth = require("../middleware/authenticator");
const mongoose = require("mongoose");
const { User } = require("../db/models/user");
const { Room } = require("../db/models/room");

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
    if (!req.body) {
      return res.redirect("/users");
    }

    try {
      const session = await mongoose.startSession();

      let user1, user2;
      await mongoose.connection.transaction(
        async (session) => {
          user1 = await User.findById(req.user._id).exec();
          user2 = await User.findById(req.body.userId).exec();
          user1.friends.push(user2._id);
          user2.friends.push(user1._id);
          await user1.save();
          await user2.save();
        },
        { readPreference: "primary" }
      );

      const newRoom = await Room.create({
        users: [user1, user2],
        mostRecentMessage: {
          text: "click here to start new convo!",
        },
      });

      res.redirect(`/rooms/${newRoom._id}`);
    } catch (err) {
      console.log(err);
      next(err);
    }
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
    const room = await Room.findById(req.params.roomId).exec();
    if (!room) {
      return res.redirect("/");
    }

    let otherUser;
    room.users.forEach((user) => {
      if (user._id.toString() !== req.user._id.toString()) {
        otherUser = user;
      }
    });

    res.render("room", {
      header: `@${otherUser.username}`,
      room,
      otherUser,
    });
  }),
];
