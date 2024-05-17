// Constants for IndexedDB database and object store names
const PLANT_IDB_NAME = "plant"; // Name of the IndexedDB database for plant data
const PLANT_DETAILS_STORE_NAME = "plantDetails"; // Name of the object store for plant details
const SYNC_PLANTS_STORE_NAME = "sync-plants"; // Name of the object store for synced plants
const SYNC_PLANT_EVENT = "sync-plant"; // Event name for syncing a plant
const SYNC_PLANT_DB = "syncPlantDB"; // Name of the IndexedDB database for syncing plants

/**
 * Function to add a new plant to the IndexedDB for synced plants.
 * @param {IDBDatabase} syncPlantIDB - IndexedDB instance for synced plants.
 * @param {Object} plantDetails - Details of the plant to be added.
 * @returns {Promise} - Promise resolving to the added plant details.
 */
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

/**
 * Function to retrieve all synced plants from IndexedDB.
 * @param {IDBDatabase} syncPlantIDB - IndexedDB instance for synced plants.
 * @returns {Promise} - Promise resolving to an array of synced plant details.
 */
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

/**
 * Function to delete a synced plant from IndexedDB.
 * @param {IDBDatabase} syncPlantIDB - IndexedDB instance for synced plants.
 * @param {number} id - ID of the plant to be deleted.
 */
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

/**
 * Function to delete all synced plants from IndexedDB.
 * @param {IDBDatabase} syncPlantIDB - IndexedDB instance for synced plants.
 * @returns {Promise} - Promise resolving when all synced plants are deleted.
 */
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

/**
 * Function to open the IndexedDB for synced plants.
 * @returns {Promise} - Promise resolving to the IndexedDB instance.
 */
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
