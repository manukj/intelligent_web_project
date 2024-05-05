let socket = io();
const urlParams = new URLSearchParams(window.location.search);
let plantId = "";
let loggedInUserName = "";
var chatMessages = [];

function init() {
  joinPlantChatRoom();
  getChatHistory(plantId);
  registerSocket();
  registerFormSubmit();
  listenForOnlineSync();
}

function listenForOnlineSync() {
  if (navigator.onLine) {
    changeOnlineStatus(true);
  } else {
    changeOnlineStatus(false);
  }
  window.addEventListener("online", function () {
    changeOnlineStatus(true);
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
  window.addEventListener("offline", function () {
    changeOnlineStatus(false);
    console.log("You are now offline.");
  });
}

function changeOnlineStatus(isOnline) {
  const onlineColorDiv = document.getElementById("onlineColor");
  const onlineText = document.getElementById("onlineText");
  if (isOnline) {
    onlineText.innerHTML = "Online";
    onlineColorDiv.classList.add("bg-green-500");
    onlineColorDiv.classList.remove("bg-red-500");
  } else {
    onlineText.innerHTML = "Offline";
    onlineColorDiv.classList.add("bg-red-500");
    onlineColorDiv.classList.remove("bg-green-500");
  }
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

function sendMessage(isSuggestingName = false) {
  var input = document.getElementById("chat_input");
  if (input.value === "") {
    return;
  }
  var chatMessage = {};
  if (isSuggestingName) {
    chatMessage = {
      chat_message: input.value,
      user_name: loggedInUserName,
      chat_time: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
      plant_id: plantId,
      suggested_name: {
        name: input.value,
        isApprovedByOwner: false,
      },
    };
  } else {
    chatMessage = {
      chat_message: input.value,
      user_name: loggedInUserName,
      chat_time: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
      plant_id: plantId,
    };
  }

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
  fetch(`/chat/addChatMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatMessage: message,
    }),
  })
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
    message.chat_time = message.chat_time.replace(/T/, " ").replace(/\..+/, "");
    const chatMessageDiv = createChatMessageElement(message);
    chatContainer.appendChild(chatMessageDiv);
  });
}

