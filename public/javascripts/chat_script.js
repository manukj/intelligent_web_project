let socket = io();
const urlParams = new URLSearchParams(window.location.search);
let plantId = "";
let loggedInUserName = "";
var chatMessages = [];

function init() {
  joinPlantChatRoom();
  getChatHistory(plantId);
  registerSocket();
}

function sendMessage() {
  console.log("Form submitted");
  var input = document.getElementById("chat_input");
  socket.emit("chat", {
    chat_message: input.value,
    user_name: loggedInUserName,
    chat_time: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
    plant_id: plantId,
  });
  input.value = "";
}

function registerSocket() {
  socket.on("joined", function (room, userId) {
    console.log("user " + userId + " joined Room: " + room);
    if (userId === loggedInUserName) {
      console.log("You joined the room");
    } else {
      console.log("Someone joined the room");
    }
  });

  socket.on("chat_message", function (msg) {
    console.log("Received message:", msg);
    const chatContainer = document.getElementById("chat_messages");
    const chatMessageDiv = createChatMessageElement(msg);
    chatContainer.appendChild(chatMessageDiv);
  });
}

function joinPlantChatRoom() {
  console.log("Joining room");
  var roomNo = plantId;
  var name = loggedInUserName;
  socket.emit("create_or_join", roomNo, name);
}

function getChatHistory(plant_id) {
  fetch(`/chat/getChatMessages/${plant_id}`)
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch chat messages");
      }
    })
    .then((chatMessages) => {
      console.log("Chat Messages:", chatMessages);
      renderChatMessages(chatMessages);
    })
    .catch((error) => {
      console.error("Error fetching chat messages:", error.message);
    });
}

function renderChatMessages(chatMessages) {
  const chatContainer = document.getElementById("chat_messages");
  chatMessages.forEach((message) => {
    const chatMessageDiv = createChatMessageElement(message);
    chatContainer.appendChild(chatMessageDiv);
  });
}

function createChatMessageElement(message) {
  // Create chat message elements
  const chatMessageDiv = document.createElement("div");
  chatMessageDiv.classList.add(
    "chat",
    message.user_name === loggedInUserName ? "chat-end" : "chat-start"
  );

  const chatImageDiv = document.createElement("div");
  chatImageDiv.classList.add("chat-image", "avatar");
  chatImageDiv.innerHTML = `
    <div class="avatar placeholder rounded-full border bg-neutral shadow-2xl">
      <div class="text-neutral-content rounded-full w-10">
        <span class="text-lg font-extrabold">${message.user_name
          .substring(0, 2)
          .toUpperCase()}</span>
      </div>
    </div>
  `;

  function generateRandomColor(name) {
    const colors = [
      "#FF5733",
      "#C70039",
      "#900C3F",
      "#581845",
      "#FFC300",
      "#DAF7A6",
      "#FF5733",
      "#C70039",
      "#900C3F",
      "#581845",
      "#FFC300",
      "#DAF7A6",
    ];
    const index = name.charCodeAt(0) + (name.charCodeAt(1) % colors.length);
    return colors[index];
  }

  const chatHeaderDiv = document.createElement("div");
  chatHeaderDiv.classList.add("chat-header");
  chatHeaderDiv.textContent = message.user_name;

  const chatBubbleDiv = document.createElement("div");
  chatBubbleDiv.classList.add("chat-bubble");
  chatBubbleDiv.textContent = message.chat_message;

  const chatFooterDiv = document.createElement("div");
  chatFooterDiv.classList.add("chat-footer");
  chatFooterDiv.innerHTML = `<time class="text-xs opacity-50">${message.chat_time}</time>`;

  // Append elements to chat container
  chatMessageDiv.appendChild(chatImageDiv);
  chatMessageDiv.appendChild(chatHeaderDiv);
  chatMessageDiv.appendChild(chatBubbleDiv);
  chatMessageDiv.appendChild(chatFooterDiv);

  return chatMessageDiv;
}
