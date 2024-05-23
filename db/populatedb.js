require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const { User } = require("./models/user");
const { Room } = require("./models/room");
const { Message } = require("./models/message");

const users = [];
const rooms = [];
const messages = [];

const uri = process.env.MONGO_URI;

main();
async function main() {
  try {
    await mongoose.connect(uri);
    console.log("connected to MongoDB");
    const session = await mongoose.startSession();
    console.log("session started");
    await mongoose.connection.transaction(
      async (session) => {
        console.log("transaction started");
        await createUsers();
        await createRooms();
        await createMessages();
      },
      { readPreference: "primary" }
    );
    console.log("transaction completed successfully");
    await mongoose.connection.close();
    console.log("mongoose connection closed");
  } catch (err) {
    console.error(err);
  }
}

async function createUsers() {
  console.log("creating users");
  await Promise.all([
    addOneUser(0, "maximilian", "maximilian@gmail.com", "123456"),
    addOneUser(1, "theodor", "theo@gmail.com", "123456"),
    addOneUser(2, "arhum", "arhum@gmail.com", "123456"),
    addOneUser(3, "cj", "cj@gmail.com", "123456"),
    addOneUser(4, "sketch", "sketch@gmail.com", "123456"),
  ]);
}

async function createRooms() {
  console.log("creating rooms");
  await Promise.all([
    addOneRoom(0, [users[0], users[1]]), // max + theo
    addOneRoom(1, [users[2], users[3]]), // arhum + cj
    addOneRoom(2, [users[0], users[2]]), // max + arhum
  ]);
}

async function createMessages() {
  console.log("creating messages");
  await addOneMessage(0, "yo theo", users[0], rooms[0]); // max to theo (room 0)
  await addOneMessage(1, "how's it goin max", users[1], rooms[0]); // theo to max (room 0)
  await addOneMessage(2, "theo u cool", users[0], rooms[0]); // max to theo (room 0) LAST MESSAGE
  await addOneMessage(3, "hey cj!", users[2], rooms[1]); // arhum to cj (room 1)
  await addOneMessage(4, "yo what's up arhum!", users[3], rooms[1]); // cj to arhum (room 1) LAST MESSAGE
  await addOneMessage(5, "arhum u so cool", users[0], rooms[2]); // max to arhum (room 2)
  await addOneMessage(6, "max u sweet", users[2], rooms[2]); // arhum to max (room 2) LAST MESSAGE
}

async function addOneUser(index, username, email, password) {
  console.log(`adding user ${index} with username '${username}'`);

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAvatar = gravatar.url(email, { s: 100, r: "g", d: "retro" }, true);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    avatar: newAvatar,
    friends: [],
  });

  users[index] = newUser;
}

async function addOneRoom(index, users) {
  console.log(
    `adding room ${index} with users '${users[0].username}' and '${users[1].username}'`
  );

  const newRoom = await Room.create({
    users,
  });

  console.log("making users friends");
  const user1 = await User.findById(users[0]._id).exec();
  const user2 = await User.findById(users[1]._id).exec();
  user1.friends.push(user2._id);
  user2.friends.push(user1._id);
  await user1.save();
  await user2.save();

  rooms[index] = newRoom;
}

async function addOneMessage(index, text, user, room) {
  console.log(`adding message ${index} with text '${text}'`);

  const newMessage = await Message.create({
    text,
    user,
    room,
  });

  console.log("updating room's most recent message");
  const updatedRoom = await Room.findById(room._id).exec();
  updatedRoom.mostRecentMessage = newMessage;
  await updatedRoom.save();

  messages[index] = newMessage;
}
