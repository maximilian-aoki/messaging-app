// get current room info
const roomId = document
  .getElementById("chatRoomId")
  .getAttribute("data-chatRoomId");
const userId = document.getElementById("userId").getAttribute("data-userId");
const initPointer = Number(
  document.getElementById("initPointer").getAttribute("data-initPointer")
);

// get elements
const form = document.getElementById("chatForm");
const frame = document.getElementById("chatFrame");
const textInput = document.getElementById("chatText");

// init elements
frame.scrollTop = frame.scrollHeight;

// init socket
const socket = io({
  auth: {
    offset: initPointer,
    roomId: roomId,
  },
});

// on incoming message
socket.on("message", (messageObj, pointer) => {
  // check if message came from client and adjust style accordingly
  const isMsgFromClient = messageObj.user.toString() === userId;
  const styleObj = {
    bgColor: isMsgFromClient ? "bg-blue-500" : "bg-slate-200",
    textColor: isMsgFromClient ? "text-white" : "",
    timeColor: isMsgFromClient ? "text-gray-300" : "text-slate-500",
    layout: isMsgFromClient ? "self-end" : "",
  };

  // create new message element in client html
  const newMessage = document.createElement("div");
  newMessage.setAttribute(
    "class",
    `${styleObj.bgColor} ${styleObj.layout} p-2 rounded-lg flex flex-col w-fit max-w-[90%]`
  );

  newMessage.innerHTML = `
    <p class="${styleObj.textColor}">${messageObj.text}<p>
    <p class="${styleObj.timeColor} text-sm italic text-end">${messageObj.formattedTimestamp}<p>
  `;

  // append new message element to scroll frame and go to bottom of scroll div
  frame.appendChild(newMessage);
  frame.scrollTop = frame.scrollHeight;

  // increment the client pointer offset
  socket.auth.offset = pointer;
});

// on error
socket.on("error", (err) => {
  console.log(err);
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

    socket.emit("message", newMessage);
    textInput.value = "";
  } else {
    console.log("socket disconnected.. try again later");
  }
});
