// Declare a variable to hold the logged-in user information
let loggedInUser = null;

// Function to initialize the application
function init() {
  // Listen for location updates
  listenToLocationUpdate();
  // Register form submit event
  registerFormSubmit();
  // Get the logged-in user
  getLoggedInUser();
}

// Function to get the logged-in user
function getLoggedInUser() {
  // Asynchronously retrieve the user name
  getUserName().then((userName) => {
    // If user name exists, set it as the logged-in user
    if (userName) {
      loggedInUser = userName.value;
    }
  });
}

// Function to listen for location update button click
function listenToLocationUpdate() {
  document.getElementById("updateLocationBtn").addEventListener("click", function () {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      // Get current position
      navigator.geolocation.getCurrentPosition(
          function (position) {
            // Extract latitude and longitude
            var latitude = position.coords.latitude.toFixed(4);
            var longitude = position.coords.longitude.toFixed(4);
            // Update location field with coordinates
            document.getElementById("location").value = latitude + "°, " + longitude + "°";
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

// Function to toggle visibility of flower color field based on checkbox
function toggleFlowerColor() {
  var flowerColorField = document.getElementById("flowerColorField");
  var flowersCheckbox = document.getElementById("flowers");
  if (flowersCheckbox.checked) {
    flowerColorField.classList.remove("hidden");
  } else {
    flowerColorField.classList.add("hidden");
  }
}

// Function to register form submission event
function registerFormSubmit() {
  const plantForm = document.getElementById("plantForm");
  if (plantForm) {
    plantForm.addEventListener("submit", function (event) {
      event.preventDefault();
      // Call function to add new plant details
      addNewPlantDetails();
    });
  } else {
    console.error("plantForm element not found");
  }
}

// Function to add new plant details
function addNewPlantDetails() {
  // Get values from form fields
  const plantName = document.getElementById("plantName").value;
  const date = document.getElementById("date").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;
  const height = document.getElementById("height").value;
  const spread = document.getElementById("spread").value;
  const characteristics = Array.from(document.querySelectorAll('input[name="characteristics"]:checked')).map((checkbox) => checkbox.value);
  const flowerColor = document.getElementById("flowerColor").value;
  const sunExposure = document.getElementById("sunExposure").value;
  const photo = document.getElementById("photoID").files[0];

  // Create an object with plant details
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

  // Check if online
  if (navigator.onLine) {
    // If online, submit plant details
    submitPlantDetails(plantDetails);
  } else {
    // If offline, store plant details in sync DB
    openSyncPlantIDB().then((db) => {
      addNewPlantToSync(db, plantDetails).then((data) => {
        console.log("Plant added to Sync DB");
        // Redirect to home page
        window.location.href = "/";
      });
    });
  }
}

// Function to submit plant details
function submitPlantDetails(plantDetails) {
  // Create form data object
  const formData = new FormData();
  // Append plant details to form data
  for (const key in plantDetails) {
    formData.append(key, plantDetails[key]);
  }
  // Append logged-in user
  formData.append("user", loggedInUser);
  // Get current URL
  const currentUrl = window.location.href;
  // Construct URL for submitting plant details
  const url = currentUrl + "/addNewPlant";
  // Send POST request to server with plant details
  fetch(url, {
    method: "POST",
    body: formData,
  })
      .then((response) => {
        // Redirect to home page if successful
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

// Function to listen for online event and sync data
function listenForOnlineSync() {
  window.addEventListener("online", async () => {
    // Check if there are plants in sync DB and update
    const isThereSyncPlant = await checkIfThereIsSyncPlantAndUpdate();
    // If no plants in sync DB, get plants from network
    if (!isThereSyncPlant) {
      getPlantsFromNetwork();
    }
  });
}
