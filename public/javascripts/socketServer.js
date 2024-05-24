const cbSocket = (socket) => {
  console.log("user connected");
  socket.join(socket.handshake.auth.roomId.toString());

  socket.on("message", (messageObj) => {
    console.log(messageObj);
  });

  socket.on("disconnect", () => {
    socket.leave(socket.handshake.auth.roomId.toString());
    console.log("user disconnected");
  });
};

module.exports = {
  cbSocket,
};
