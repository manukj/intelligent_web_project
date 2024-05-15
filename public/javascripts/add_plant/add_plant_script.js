function init() {
  listenToLocationUpdate();
  registerFormSubmit();
  //listenForOnlineSync();
}

function listenToLocationUpdate() {
  document
    .getElementById("updateLocationBtn")
    .addEventListener("click", function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            document.getElementById("location").value =
              latitude + ", " + longitude;
          },
          function (error) {
            console.log("Error getting location:", error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    });
}

function toggleFlowerColor() {
  var flowerColorField = document.getElementById("flowerColorField");
  var flowersCheckbox = document.getElementById("flowers");
  if (flowersCheckbox.checked) {
    flowerColorField.classList.remove("hidden");
  } else {
    flowerColorField.classList.add("hidden");
  }
}

function registerFormSubmit() {
  const plantForm = document.getElementById("plantForm");
  if (plantForm) {
    plantForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addNewPlantDetails();
    });
  } else {
    console.error("plantForm element not found");
  }
}

function addNewPlantDetails() {
  const plantName = document.getElementById("plantName").value;
  const date = document.getElementById("date").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;
  const height = document.getElementById("height").value;
  const spread = document.getElementById("spread").value;
  const characteristics = Array.from(
    document.querySelectorAll('input[name="characteristics"]:checked')
  ).map((checkbox) => checkbox.value);
  const flowerColor = document.getElementById("flowerColor").value;
  const sunExposure = document.getElementById("sunExposure").value;
  const photo = document.getElementById("photoID").files[0];

  const plantDetails = {
    plantName,
    date,
    location,
    description,
    height,
    spread,
    characteristics,
    flowerColor,
    sunExposure,
    photo,
  };

  openSyncPlantIDB().then((db) => {
    addNewPlantToSync(db, plantDetails).then((data) => {
      console.log("added data inside Index db", data);
      if (navigator.onLine) {
        console.log("Plant added to Sync DB");
        submitPlantDetails(plantDetails);
      } else {
        console.log("Plant added to Sync DB");
        window.location.href = "/";
      }
    });
  });
}
function submitPlantDetails(plantDetails) {
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
function listenForOnlineSync() {
  window.addEventListener("online", function () {
    console.log("You are now online.");
    openSyncPlantIDB().then((db) => {
      getAllSyncPlants(db).then((syncPlants) => {
        syncPlants.forEach((data) => {
          console.log("syncing data offline plant", data.value);
          // Send data.value to the server or perform any other action
          deleteSyncPlantFromIDB(db, data.id);
        });
      });
    });
  });
  window.addEventListener("offline", function () {
    console.log("You are now offline.");
  });
}
