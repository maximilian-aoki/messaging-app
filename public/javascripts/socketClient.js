// get current room client is in and client's id
const roomId = document
  .getElementById("chatRoomId")
  .getAttribute("data-chatRoomId");
const userId = document.getElementById("userId").getAttribute("data-userId");

// get elements
const form = document.getElementById("chatForm");
const frame = document.getElementById("chatFrame");
const textInput = document.getElementById("chatText");

// init socket
const socket = io({
  auth: {
    offset: 0,
    roomId: roomId,
  },
});

// on incoming message
socket.on("message", (messageObj) => {
  console.log(messageObj);
});

// form submit listener
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (socket.connected) {
    const newMessage = {
      text: textInput.value,
      user: userId,
      room: roomId,
    };

    console.log(newMessage);
    socket.emit("message", newMessage);
  } else {
    console.log("socket disconnected.. try again later");
  }
});
