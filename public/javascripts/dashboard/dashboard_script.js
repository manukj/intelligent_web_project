function showDetailsPage(id) {
  window.location.href = "details/" + id + "/" + loggedInUser;
}

function openAddPlantPage() {
  window.location.href = "/addPlant";
}

function init() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
  }
  getPlantsFromIndexDb();
}

function getPlantsFromIndexDb() {
  openSyncPlantIDB().then((db) => {
    getAllSyncPlants(db).then((syncPlants) => {
      syncPlants.forEach((data) => {
        console.log("syncing data offline plant", data.value);
      });
    });
  });
}
