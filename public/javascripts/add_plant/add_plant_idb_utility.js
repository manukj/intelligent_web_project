// Constants for plant and plantDetails
const PLANT_IDB_NAME = "plant";
const PLANT_DETAILS_STORE_NAME = "plantDetails";
const SYNC_PLANTS_STORE_NAME = "sync-plants";
const SYNCH_PLANT_EVENT = "sync-plant";

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

function openSyncPlantIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("syncPlantDB", 1);

        request.onerror = function (event) {
            reject(new Error("IndexedDB error: " + event.target.errorCode));
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            const objectStore = db.createObjectStore("syncPlants", { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("value", "value", { unique: false });
        };
    });
}

