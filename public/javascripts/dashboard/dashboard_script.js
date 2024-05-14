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
    getAllPlants();
}
function getAllPlants() {
  fetch('/getAllPlantDetails')
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch all plants");
        }
      })
      .then((plants) => {
        console.log("Plants fetched successfully:", plants);
      })
      .catch((error) => {
        console.error("Error fetching plants:", error.message);
      });
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