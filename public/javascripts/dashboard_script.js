function showDetailsPage(id) {
  window.location.href = "details/" + id+"/Mark";
}

function openAddPlantPage() {
  window.location.href = "/addPlant";
}

function showDropdown() {
  const sortDropdown = document.getElementById("sortDropdown");
  sortDropdown.classList.toggle("hidden");
}

function sortPlantsByDate() {
  plantData.sort(compareByDate);
  // Re-render the plant sightings (implementation depends on your framework)
}

function sortPlantsByDistance() {
  plantData.sort(compareByDistance); // Implement comparison logic here
  // Re-render the plant sightings (implementation depends on your framework)
}

// Implement comparison function for sorting by distance (assuming 'distance' property)
function compareByDistance(a, b) {
  // Replace this with your logic to compare distances (e.g., calculate and compare distances)
  return a.distance - b.distance;
}

