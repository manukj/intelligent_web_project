let plantLists; // Variable to store the list of plants

// Function to navigate to the plant details page
function showDetailsPage(id) {
  window.location.href = "details/" + id + "/" + loggedInUser;
}

// Function to navigate to the add plant page
function openAddPlantPage() {
  window.location.href = "/addPlant";
}

// Function to initialize the application
async function init() {
  checkIfUserLoggedIn(); // Ensure user is logged in
  if ("serviceWorker" in navigator) {
    // Register the service worker for offline functionality
    navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
  }
  if (navigator.onLine) {
    // Check if there are any plants that need to be synced and update them
    const isThereSyncPlant = await checkIfThereIsSyncPlantAndUpdate();
    if (!isThereSyncPlant) {
      getPlantsFromNetwork(); // Fetch plants from the network if online
    }
  } else {
    getPlantsFromIDB(); // Fetch plants from IndexedDB if offline
  }
  listenForOnlineSync(); // Listen for online event to sync plants
}

// Function to check for offline-synced plants and update them
async function checkIfThereIsSyncPlantAndUpdate() {
  return new Promise(async (resolve, reject) => {
    let isThereSyncPlant = false;
    try {
      const plants = await getPlantsFromIndexDb(); // Fetch plants from IndexedDB
      plants.forEach((plant) => {
        // Check if plants are offline-synced (do not have _id)
        if (!plant._id) {
          if (navigator.onLine) {
            addPlantToMongoDb(plant); // Add the offline-synced plant to MongoDB
          }
        }
      });
      resolve(isThereSyncPlant);
    } catch (error) {
      console.error("Error checking for sync plants:", error);
      reject(error);
    }
  });
}

// Function to add a plant to MongoDB
function addPlantToMongoDb(plantDetails) {
  const formData = new FormData();
  formData.append("plantName", plantDetails.plantName);
  formData.append("date", plantDetails.date);
  formData.append("location", plantDetails.location);
  formData.append("description", plantDetails.description);
  formData.append("height", plantDetails.height);
  formData.append("spread", plantDetails.spread);
  formData.append("characteristics", plantDetails.characteristics);
  formData.append("flowerColor", plantDetails.flowerColor);
  formData.append("sunExposure", plantDetails.sunExposure);
  formData.append("photo", plantDetails.photo);
  formData.append("user", loggedInUser);

  // POST request to add the new plant
  fetch("addPlant/addNewPlant", {
    method: "POST",
    body: formData,
  })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/"; // Redirect to the home page on success
        } else {
          console.error("Error submitting plant details");
        }
      })
      .catch((error) => {
        console.error("Error submitting plant details:", error);
      });
}

// Function to fetch plants from the network
async function getPlantsFromNetwork() {
  try {
    plantLists = await fetch("/getAllPlantDetails").then(async (response) => {
      if (response.ok) {
        return response.json(); // Parse the JSON response
      } else {
        throw new Error("Failed to fetch all plants");
      }
    });
    console.log("Plants fetched successfully:", plantLists);
    renderPlantsList(plantLists); // Render the fetched plants
    addAllPlantsToIDB(plantLists); // Add fetched plants to IndexedDB
  } catch (error) {
    console.error("Error fetching plants:", error.message);
    renderPlantsList([]); // Render an empty list on error
  }
}

// Function to fetch plants from IndexedDB
async function getPlantsFromIDB() {
  plantLists = await getPlantsFromIndexDb();
  renderPlantsList(plantLists); // Render the plants fetched from IndexedDB
}

// Function to add all plants to IndexedDB
function addAllPlantsToIDB(plants) {
  openSyncPlantIDB().then(async (db) => {
    await deleteAllSyncPlantsFromIDB(db); // Clear existing plants in IndexedDB
    plants.forEach((plant) => {
      addNewPlantToSync(db, plant); // Add each new plant to IndexedDB
    });
  });
}

// Function to fetch plants from IndexedDB
function getPlantsFromIndexDb() {
  return new Promise((resolve, reject) => {
    openSyncPlantIDB()
        .then((db) => {
          return getAllSyncPlants(db); // Get all plants from IndexedDB
        })
        .then((syncPlants) => {
          console.log("Plants fetched from IndexDB:", syncPlants);
          plantLists = [];
          syncPlants.forEach((plant) => {
            plantLists.push(plant.value); // Add each plant to the plant list
          });
          resolve(plantLists);
        })
        .catch((error) => {
          console.error("Error getting plants from IndexDB:", error.message);
          reject(error);
        });
  });
}

// Function to sort the plant list
function sortList(sortType) {
  if (sortType === 0) {
    // Sort by date (ascending)
    plantLists.sort((plantA, plantB) => {
      return new Date(plantA.date) - new Date(plantB.date);
    });
  } else if (sortType === 1) {
    // Sort by location (approximate string comparison)
    plantLists.sort((plantA, plantB) => {
      return plantA.location.localeCompare(plantB.location);
    });
  }

  renderPlantsList(plantLists); // Re-render the sorted plant list
}

// Function to listen for online event and sync plants
function listenForOnlineSync() {
  window.addEventListener("online", async () => {
    const isThereSyncPlant = await checkIfThereIsSyncPlantAndUpdate();
    if (!isThereSyncPlant) {
      getPlantsFromNetwork(); // Fetch plants from the network if online
    }
  });
}
