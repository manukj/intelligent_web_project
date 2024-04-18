let socket = io();
const urlParams = new URLSearchParams(window.location.search);
const plantId = urlParams.get("plant_id");
const loggedInUserId = urlParams.get("user_name");
var chatMessages = [];

function init() {
  var form = document.getElementById("chat_form");
  var input = document.getElementById("chat_input");
  // read plant_id and user_id from the URL

  joinPlantChatRoom();
  getChatHistory(plantId);
  registerSocket();
  // registerListener(form, input);
}

function registerListener(form, input) {
  form.addEventListener("submit", function (e) {
    console.log("Form submitted");
    // socket.emit("chat", {
    //   chat_message: input.value,
    //   user_name: loggedInUserId,
    //   chat_time: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
    //   plant_id: plantId,
    // });
  });
}

function sendMessage() {
  console.log("Form submitted");
  var input = document.getElementById("chat_input");
  socket.emit("chat", {
    chat_message: input.value,
    user_name: loggedInUserId,
    chat_time: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
    plant_id: plantId,
  });
  input.value = "";
}

function registerSocket() {
  socket.on("joined", function (room, userId) {
    console.log("user " + userId + " joined Room: " + room);
    if (userId === loggedInUserId) {
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
  var name = loggedInUserId;
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
    message.user_name === loggedInUserId ? "chat-end" : "chat-start"
  );

  const chatImageDiv = document.createElement("div");
  chatImageDiv.classList.add("chat-image", "avatar");
  chatImageDiv.innerHTML = `
    <div class="w-10 rounded-full">
      <img alt="User Avatar" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  `;

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
