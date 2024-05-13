const USERS_STORE_NAME = "users";
const USER_IDB_NAME = "userIDB";

function logout(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USERS_STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(USERS_STORE_NAME);

    const request = objectStore.clear();

    request.onsuccess = function () {
      console.log("User logged out successfully.");
      resolve();
    };

    request.onerror = function (event) {
      console.error("Error logging out:", event.target.error);
      reject(event.target.error);
    };
  });
}

function loggedInUser(username, db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USERS_STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(USERS_STORE_NAME);

    const request = objectStore.add(username);
    request.onsuccess = function () {
      console.log("User logged in successfully.");
      resolve();
    };
    request.onerror = function (event) {
      console.error("Error logging in:", event.target.error);
      reject(event.target.error);
    };
  });
}

function getUserName(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USERS_STORE_NAME], "readonly");
    const objectStore = transaction.objectStore(USERS_STORE_NAME);
    const request = objectStore.getAll();
    request.onsuccess = function (event) {
      const users = event.target.result;
      const userName = users[users.length - 1];
      console.log("User name:", userName);
      resolve(userName);
    };
    request.onerror = function (event) {
      console.error("Error getting user name:", event.target.error);
      reject(event.target.error);
    };
  });
}

function initializeUserIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(USER_IDB_NAME, 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore(USERS_STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      console.log("Database initialized successfully.");
      resolve(db);
    };

    request.onerror = function (event) {
      console.error("Error initializing database:", event.target.error);
      reject(event.target.error);
    };
  });
}
