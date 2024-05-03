let socket = io();
const urlParams = new URLSearchParams(window.location.search);
let plantId = "";
let loggedInUserName = "";
var chatMessages = [];
var totalUsersOnlineInRoom = 0;

function init() {
  joinPlantChatRoom();
  getChatHistory(plantId);
  registerSocket();
  registerFormSubmit();
  listenForOnlineSync();
}

function listenForOnlineSync() {
  window.addEventListener("online", function () {
    console.log("You are now online.");
    openSyncChatsIDB().then((db) => {
      getAllSyncChatMessages(db).then((syncChats) => {
        syncChats.forEach((data) => {
          console.log("syncing data offline chat", data.value);
          socket.emit("chat", data.value);
          deleteSyncChatFromIDB(db, data.id);
        });
      });
    });
  });
}

function registerFormSubmit() {
  const chatForm = document.getElementById("chat_form");
  if (chatForm) {
    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      sendMessage();
    });
  } else {
    console.error("chat_form element not found");
  }
}

function sendMessage() {
  var input = document.getElementById("chat_input");
  var chatMessage = {
    chat_message: input.value,
    user_name: loggedInUserName,
    chat_time: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
    plant_id: plantId,
  };

  openSyncChatsIDB().then((db) => {
    addNewChatToSync(db, chatMessage).then((data) => {
      renderChatMessages([data.value]);
      if (navigator.onLine) {
        console.log("Chat added to Sync DB");
        input.value = "";
        console.log("chatMessage", chatMessage);
        socket.emit("chat", chatMessage);
        deleteSyncChatFromIDB(db, data.id);
      } else {
        console.log("Chat added to Sync DB");
        input.value = "";
        console.log("chatMessage", chatMessage);
      }
    });
  });
}

function registerSocket() {
  socket.on("joined", function (room, userId, totalUsers) {
    totalUsersOnlineInRoom = totalUsers;
    const totalOnlineField = document.getElementById("totalOnline");
    totalOnlineField.textContent = totalUsersOnlineInRoom;
    console.log(
      "user " + userId + " joined Room: " + room + " Total Users: " + totalUsers
    );
    if (userId === loggedInUserName) {
      console.log("You joined the room");
    } else {
      console.log("Someone joined the room");
    }
  });

  socket.on("left", function (room, userId, totalUsers) {
    console.log("user " + userId + " left Room: " + room);
  });

  socket.on("chat_message", function (msg) {
    console.log("Received message:", msg);
    addChatToDB(msg);
  });
}

function addChatToDB(message) {
  fetch(
    `/chat/addChatMessage/${plantId}/${loggedInUserName}/${message.chat_message}`
  )
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to add chat message");
      }
    })
    .then((chatMessage) => {
      console.log("Chat Message added to DB:", chatMessage);
    })
    .catch((error) => {
      console.error("Error adding chat message to DB:", error.message);
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
    <div class="avatar placeholder rounded-full border bg-neutral ">
      <div class="text-neutral-content rounded-full w-10">
        <span class="text-lg font-extrabold">${message.user_name
          .substring(0, 2)
          .toUpperCase()}</span>
      </div>
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
