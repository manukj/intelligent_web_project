const USERS_STORE_NAME = "users";
const USER_IDB_NAME = "userIDB";

var loggedInUser;

function logout() {
  return new Promise((resolve, reject) => {
    initializeUserIDB().then((db) => {
      const transaction = db.transaction([USERS_STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(USERS_STORE_NAME);

      const request = objectStore.clear();

      request.onsuccess = function () {
        console.log("User logged out successfully.");
        resolve();
        onUserLoggedOut();
      };

      request.onerror = function (event) {
        console.error("Error logging out:", event.target.error);
        reject(event.target.error);
      };
    });
  });
}

function logInUser() {
  var loginInTextField = document.getElementById("user_name");
  var userName = loginInTextField.value;
  loginInTextField.value = "";
  return new Promise((resolve, reject) => {
    initializeUserIDB()
      .then((db) => {
        const transaction = db.transaction([USERS_STORE_NAME], "readwrite");
        const userStore = transaction.objectStore(USERS_STORE_NAME);
        const addRequest = userStore.add({ value: userName });
        addRequest.addEventListener("success", () => {
          console.log("Added " + "#" + addRequest.result + ": " + userName);
          const getRequest = userStore.get(addRequest.result);
          getRequest.addEventListener("success", () => {
            loggedInUser = userName;
            resolve(getRequest.result);
            onUserLoggedIn();
          });
          getRequest.addEventListener("error", (event) => {
            reject(event.target.error);
          });
        });
        addRequest.addEventListener("error", (event) => {
          reject(event.target.error);
        });
      })
      .catch((error) => {
        reject(error);
      });
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

    request.onerror = function (event) {
      reject(new Error(`Database error: ${event.target}`));
    };

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
  });
}

function checkIfUserLoggedIn() {
  return new Promise((resolve, reject) => {
    initializeUserIDB()
      .then((db) => {
        getUserName(db)
          .then((userName) => {
            if (userName) {
              loggedInUser = userName.value;
              onUserLoggedIn();
              resolve(userName);
            } else {
              onUserLoggedOut();
            }
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}
