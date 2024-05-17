let plantLists;
function showDetailsPage(id) {
  window.location.href = "details/" + id + "/" + loggedInUser;
}

function openAddPlantPage() {
  window.location.href = "/addPlant";
}

async function init() {
  checkIfUserLoggedIn();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
  }
  if (navigator.onLine) {
    const isThereSyncPlant = await checkIfThereIsSyncPlantAndUpdate();
    if (!isThereSyncPlant) {
      getPlantsFromNetwork();
    }
  } else {
    getPlantsFromIDB();
  }
  listenForOnlineSync();
}

async function checkIfThereIsSyncPlantAndUpdate() {
  return new Promise(async (resolve, reject) => {
    let isThereSyncPlant = false;
    try {
      const plants = await getPlantsFromIndexDb();
      plants.forEach((plant) => {
        // those plants which are updated offline don't have _id
        if (!plant._id) {
          if (navigator.onLine) {
            addPlantToMongoDb(plant);
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
  fetch("addPlant/addNewPlant", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Error submitting plant details");
      }
    })
    .catch((error) => {
      console.error("Error submitting plant details:", error);
    });
}

async function getPlantsFromNetwork() {
  try {
    plantLists = await fetch("/getAllPlantDetails").then(async (response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch all plants");
      }
    });
    console.log("Plants fetched successfully:", plantLists);
    renderPlantsList(plantLists);
    addAllPlantsToIDB(plantLists);
  } catch (error) {
    console.error("Error fetching plants:", error.message);
    renderPlantsList([]);
  }
}

async function getPlantsFromIDB() {
  plantLists = await getPlantsFromIndexDb();
  renderPlantsList(plantLists);
}

function addAllPlantsToIDB(plants) {
  openSyncPlantIDB().then(async (db) => {
    await deleteAllSyncPlantsFromIDB(db);
    plants.forEach((plant) => {
      addNewPlantToSync(db, plant);
    });
  });
}

function getPlantsFromIndexDb() {
  return new Promise((resolve, reject) => {
    openSyncPlantIDB()
      .then((db) => {
        return getAllSyncPlants(db);
      })
      .then((syncPlants) => {
        console.log("Plants fetched from IndexDB:", syncPlants);
        plantLists = [];
        syncPlants.forEach((plant) => {
          plantLists.push(plant.value);
        });
        resolve(plantLists);
      })
      .catch((error) => {
        console.error("Error getting plants from IndexDB:", error.message);
        reject(error);
      });
  });
}

function sortList(sortType) {
  if (sortType === 0) {
    // Sort by date (ascending)
    plantLists.sort((plantA, plantB) => {
      return new Date(plantA.date) - new Date(plantB.date);
    });
  } else if (sortType === 1) {
    // Sort by location (approximate)
    plantLists.sort((plantA, plantB) => {
      return plantA.location.localeCompare(plantB.location); // String comparison
    });
  }

  renderPlantsList(plantLists);
}

function listenForOnlineSync() {
  window.addEventListener("online", async () => {
    const isThereSyncPlant = await checkIfThereIsSyncPlantAndUpdate();
    if (!isThereSyncPlant) {
      getPlantsFromNetwork();
    }
  });
}
