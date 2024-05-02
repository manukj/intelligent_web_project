// Constants for chat and chatMessages
const CHAT_IDB_NAME = "chat";
const CHAT_MESSAGES_STORE_NAME = "chatMessages";
const SYNC_CHATS_STORE_NAME = "sync-chats";
const SYNCH_CHAT_EVENT = "sync-chat";

const addNewChatToSync = (syncChatIDB, message) => {
  return new Promise((resolve, reject) => {
    const transaction = syncChatIDB.transaction(
      [SYNC_CHATS_STORE_NAME],
      "readwrite"
    );
    const chatStore = transaction.objectStore(SYNC_CHATS_STORE_NAME);
    const addRequest = chatStore.add({ value: message });
    addRequest.addEventListener("success", () => {
      console.log("Added " + "#" + addRequest.result + ": " + message);
      const getRequest = chatStore.get(addRequest.result);
      getRequest.addEventListener("success", () => {
        resolve(getRequest.result);
      });
      getRequest.addEventListener("error", (event) => {
        reject(event.target.error);
      });
    });
    addRequest.addEventListener("error", (event) => {
      reject(event.target.error);
    });
  });
};

// // Function to add new ChatMessage to IndexedDB and return a promise
// const addChatMessageToIDB = (chatIDB, messages) => {
//   return new Promise((resolve, reject) => {
//     const transaction = chatIDB.transaction([CHAT_IDB_NAME], "readwrite");
//     const chatStore = transaction.objectStore(CHAT_MESSAGES_STORE_NAME);

//     const addPromises = messages.map((message) => {
//       return new Promise((resolveAdd, rejectAdd) => {
//         const addRequest = chatStore.add(message);
//         addRequest.addEventListener("success", () => {
//           console.log("Added " + "#" + addRequest.result + ": " + message);
//           const getRequest = chatStore.get(addRequest.result);
//           getRequest.addEventListener("success", () => {
//             console.log("Found " + JSON.stringify(getRequest.result));
//             resolveAdd();
//           });
//           getRequest.addEventListener("error", (event) => {
//             rejectAdd(event.target.error);
//           });
//         });
//         addRequest.addEventListener("error", (event) => {
//           rejectAdd(event.target.error);
//         });
//       });
//     });
//     Promise.all(addPromises)
//       .then(() => {
//         resolve();
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// // Function to remove all chatMessages from idb
// const deleteAllExistingChatMessageFromIDB = (chatIDB) => {
//   const transaction = chatIDB.transaction([CHAT_IDB_NAME], "readwrite");
//   const chatStore = transaction.objectStore(CHAT_MESSAGES_STORE_NAME);
//   const clearRequest = chatStore.clear();

//   return new Promise((resolve, reject) => {
//     clearRequest.addEventListener("success", () => {
//       resolve();
//     });

//     clearRequest.addEventListener("error", (event) => {
//       reject(event.target.error);
//     });
//   });
// };

// // Function to get the chatMessages list from the IndexedDB
// const getAllChats = (chatIDB) => {
//   return new Promise((resolve, reject) => {
//     const transaction = chatIDB.transaction([CHAT_IDB_NAME]);
//     const chatStore = transaction.objectStore(CHAT_MESSAGES_STORE_NAME);
//     const getAllRequest = chatStore.getAll();

//     // Handle success event
//     getAllRequest.addEventListener("success", (event) => {
//       resolve(event.target.result); // Use event.target.result to get the result
//     });

//     // Handle error event
//     getAllRequest.addEventListener("error", (event) => {
//       reject(event.target.error);
//     });
//   });
// };

const getAllSyncChatMessages = (syncChatIDB) => {
  return new Promise((resolve, reject) => {
    const transaction = syncChatIDB.transaction([SYNC_CHATS_STORE_NAME]);
    const chatStore = transaction.objectStore(SYNC_CHATS_STORE_NAME);
    const getAllRequest = chatStore.getAll();

    getAllRequest.addEventListener("success", () => {
      resolve(getAllRequest.result);
    });

    getAllRequest.addEventListener("error", (event) => {
      reject(event.target.error);
    });
  });
};

// Function to delete a sync chat from IndexedDB
const deleteSyncChatFromIDB = (syncChatIDB, id) => {
  const transaction = syncChatIDB.transaction(
    [SYNC_CHATS_STORE_NAME],
    "readwrite"
  );
  const chatStore = transaction.objectStore(SYNC_CHATS_STORE_NAME);
  const deleteRequest = chatStore.delete(id);
  deleteRequest.addEventListener("success", () => {
    console.log("Deleted " + id);
  });
};

// function openChatIDB() {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open(CHAT_IDB_NAME, 1);

//     request.onerror = function (event) {
//       reject(new Error(`Database error: ${event.target}`));
//     };

//     request.onupgradeneeded = function (event) {
//       const db = event.target.result;
//       db.createObjectStore(CHAT_IDB_NAME, { keyPath: "_id" });
//     };

//     request.onsuccess = function (event) {
//       const db = event.target.result;
//       resolve(db);
//     };
//   });
// }

function openSyncChatsIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SYNC_CHATS_STORE_NAME, 1);

    request.onerror = function (event) {
      reject(new Error(`Database error: ${event.target}`));
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore(SYNC_CHATS_STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      resolve(db);
    };
  });
}
