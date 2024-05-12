function init() {
    listenToLocationUpdate();
    registerFormSubmit();
    listenForOnlineSync();
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
            sendMessage();
        });
    } else {
        console.error("plantForm element not found");
    }
}

function sendMessage() {
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
    const photo = document.getElementById("photo").files[0];

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
            if (navigator.onLine) {
                console.log("Plant added to Sync DB");
                // Send plantDetails to the server or perform any other action
            } else {
                console.log("Plant added to Sync DB");
            }
        });
    });
}
function submitPlantDetails(plantDetails) {
    fetch('/submitPlant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(plantDetails)
    })
        .then(response => {
            if (response.ok) {
                // Redirect to the dashboard page
                window.location.href = '/dashboard';
            } else {
                console.error('Error submitting plant details');
            }
        })
        .catch(error => {
            console.error('Error submitting plant details:', error);
        });
}
function listenForOnlineSync() {
    if (navigator.onLine) {
        changeOnlineStatus(true);
    } else {
        changeOnlineStatus(false);
    }
    window.addEventListener("online", function () {
        changeOnlineStatus(true);
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
        changeOnlineStatus(false);
        console.log("You are now offline.");
    });
}

function changeOnlineStatus(isOnline) {
    const onlineColorDiv = document.getElementById("onlineColor");
    const onlineText = document.getElementById("onlineText");
    if (isOnline) {
        onlineText.innerHTML = "Online";
        onlineColorDiv.classList.add("bg-green-500");
        onlineColorDiv.classList.remove("bg-red-500");
    } else {
        onlineText.innerHTML = "Offline";
        onlineColorDiv.classList.add("bg-red-500");
        onlineColorDiv.classList.remove("bg-green-500");
    }
}

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