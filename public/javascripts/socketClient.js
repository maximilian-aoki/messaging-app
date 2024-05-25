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
socket.on("message", (messageObj, pointer) => {
  console.log(messageObj);
  const newMessage = document.createElement("div");
  newMessage.setAttribute(
    "class",
    "p-2 bg-slate-200 rounded-lg flex flex-col w-fit max-w-[75%]"
  );

  newMessage.innerHTML = `
    <p>${messageObj.text}<p>
    <p class="text-sm italic text-slate-500 text-end">${messageObj.formattedTimestamp}<p>
  `;

  frame.appendChild(newMessage);

  // increment the client pointer offset
  socket.auth.offset = pointer;
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
