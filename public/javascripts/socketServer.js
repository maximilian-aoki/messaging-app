const { Message } = require("../../db/models/message");

const cbSocket = async (socket) => {
  console.log("user connected");

  // get room id from handshake
  const roomId = socket.handshake.auth.roomId.toString();
  socket.join(roomId);

  // on incoming message
  socket.on("message", (messageObj) => {
    console.log(messageObj);
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
