const { Message } = require("../../db/models/message");
const { Room } = require("../../db/models/room");

const cbSocket = (io) => async (socket) => {
  console.log("user connected");

  // get room id from handshake
  const roomId = socket.handshake.auth.roomId.toString();
  socket.join(roomId);

  // on incoming message
  socket.on("message", async (messageObj) => {
    try {
      const prePointer = await Message.countDocuments({ room: roomId }).exec();
      const room = await Room.findById(messageObj.room).exec();

      // create new message and update room's most recent message
      const newMessage = await Message.create(messageObj);
      room.mostRecentMessage = newMessage;
      await room.save();

      // add formatted timestamp to socket.io incoming message
      const newMessageObj = newMessage.toObject();
      newMessageObj.formattedTimestamp = newMessage.formattedTimestamp;

      io.to(roomId).emit("message", newMessageObj, prePointer + 1);
    } catch (err) {
      socket.emit("error", err);
    }
  });

  // data recovery procedure
  if (!socket.recovered) {
    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: 1 })
      .exec();

    for (let i = socket.handshake.auth.offset; i < messages.length; i += 1) {
      let messageObj = messages[i].toObject();
      messageObj.formattedTimestamp = messages[i].formattedTimestamp;
      socket.emit("message", messageObj, i + 1);
    }
  }

  socket.on("disconnect", () => {
    socket.leave(socket.handshake.auth.roomId.toString());
    console.log("user disconnected");
  });
};

module.exports = {
  cbSocket,
};
