var placeHolderImage = "/images/placeholder.gif";
function renderPlantsList(plantList) {
  // Access the DOM element where you want to render the plantList
  const plantContainer = document.getElementById("plantList"); // Replace with your container ID

  plantContainer.innerHTML = ""; // Clear the container (optional)
  if (plantList.length === 0) {
    const noMessagesDiv = document.createElement("div");
    plantContainer.classList.remove(
      "grid",
      "grid-cols-1",
      "gap-4",
      "md:grid-cols-2",
      "lg:grid-cols-3",
      "xl:grid-cols-4"
    );
    noMessagesDiv.classList.add(
      "flex",
      "flex-col",
      "w-full",
      "h-full",
      "items-center",
      "place-content-center"
    );
    const noMessagesImg = document.createElement("img");
    noMessagesImg.src = "/images/no_plant.svg";
    noMessagesImg.classList.add("w-[400px]");
    const noMessagesText = document.createElement("div");
    noMessagesText.classList.add("text-3xl", "text-gray-500", "mt-10");
    noMessagesText.textContent = "No Plants Added ";
    noMessagesDiv.appendChild(noMessagesImg);
    noMessagesDiv.appendChild(noMessagesText);
    plantContainer.appendChild(noMessagesDiv);
  } else {
    plantList.forEach(function (plant) {
      const card = createCard(plant);
      plantContainer.appendChild(card);
    });
  }
}

function createCard(plant) {
  var card = document.createElement("div");
  if (plant.photo.type) {
    plant.photo = "images/offline_image_uploaded.svg";
  } else {
    plant.photo = "images/uploads/" + plant.photo;
  }
  card.className = "card shadow-lg bg-white cursor-pointer";
  card.onclick = function () {
    showDetailsPage(plant._id); // Call your function to show details page
  };

  var image = document.createElement("img");
  image.src = plant.photo;
  image.alt = plant.photo;
  image.onerror = function () {
    this.onerror = null;
    this.src = placeHolderImage;
  };
  image.className = "w-full h-48 object-contain border-b-2 shadow-3";

  var details = document.createElement("div");
  details.className = "p-4";

  var title = document.createElement("h3");
  title.className = "text-lg font-medium text-gray-800";
  title.textContent = plant.plantName;

  var location = document.createElement("p");
  location.className = "text-gray-600";
  location.textContent = "Location: " + plant.location;

  var dateTime = document.createElement("p");
  dateTime.className = "text-gray-600";
  dateTime.textContent = "Date/Time: " + plant.date;

  // Appending elements to card
  details.appendChild(title);
  //details.appendChild(location);
  details.appendChild(dateTime);
  card.appendChild(image);
  card.appendChild(details);

  return card;
}
