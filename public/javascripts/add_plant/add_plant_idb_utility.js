// Constants for plant and plantDetails
const PLANT_IDB_NAME = "plant";
const PLANT_DETAILS_STORE_NAME = "plantDetails";
const SYNC_PLANTS_STORE_NAME = "sync-plants";
const SYNC_PLANT_EVENT = "sync-plant";
const SYNC_PLANT_DB = "syncPlantDB";

const addNewPlantToSync = (syncPlantIDB, plantDetails) => {
  return new Promise((resolve, reject) => {
    const transaction = syncPlantIDB.transaction(
      [SYNC_PLANTS_STORE_NAME],
      "readwrite"
    );
    const plantStore = transaction.objectStore(SYNC_PLANTS_STORE_NAME);
    const addRequest = plantStore.add({ value: plantDetails });
    addRequest.addEventListener("success", () => {
      console.log("Added " + "#" + addRequest.result + ": " + plantDetails);
      const getRequest = plantStore.get(addRequest.result);
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

const getAllSyncPlants = (syncPlantIDB) => {
  return new Promise((resolve, reject) => {
    const transaction = syncPlantIDB.transaction([SYNC_PLANTS_STORE_NAME]);
    const plantStore = transaction.objectStore(SYNC_PLANTS_STORE_NAME);
    const getAllRequest = plantStore.getAll();

    getAllRequest.addEventListener("success", () => {
      resolve(getAllRequest.result);
    });

    getAllRequest.addEventListener("error", (event) => {
      reject(event.target.error);
    });
  });
};

// Function to delete a sync plant from IndexedDB
const deleteSyncPlantFromIDB = (syncPlantIDB, id) => {
  const transaction = syncPlantIDB.transaction(
    [SYNC_PLANTS_STORE_NAME],
    "readwrite"
  );
  const plantStore = transaction.objectStore(SYNC_PLANTS_STORE_NAME);
  const deleteRequest = plantStore.delete(id);
  deleteRequest.addEventListener("success", () => {
    console.log("Deleted " + id);
  });
};

const deleteAllSyncPlantsFromIDB = (syncPlantIDB) => {
  return new Promise((resolve, reject) => {
    const transaction = syncPlantIDB.transaction(
      [SYNC_PLANTS_STORE_NAME],
      "readwrite"
    );
    const plantStore = transaction.objectStore(SYNC_PLANTS_STORE_NAME);
    const clearRequest = plantStore.clear();
    clearRequest.addEventListener("success", () => {
      console.log("Cleared all sync plants");
      resolve();
    });
    clearRequest.addEventListener("error", (event) => {
      reject(event.target.error);
    });
  });
};

function openSyncPlantIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SYNC_PLANTS_STORE_NAME, 1);

    request.onerror = function (event) {
      reject(new Error("IndexedDB error: " + event.target));
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore(SYNC_PLANTS_STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });
    };
  });
}
