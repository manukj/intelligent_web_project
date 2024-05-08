function init() {
  listenToLocationUpdate();
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
