var placeHolderImage = "/images/placeholder.gif";

// Function to render the list of plants
function renderPlantsList(plantList) {
  // Access the DOM element where the plant list will be rendered
  const plantContainer = document.getElementById("plantList");

  // Clear the container to avoid duplicating content
  plantContainer.innerHTML = "";

  // Check if the plant list is empty
  if (plantList.length === 0) {
    // If no plants, create a message indicating no plants have been added
    const noMessagesDiv = document.createElement("div");

    // Remove existing grid classes to properly center the message
    plantContainer.classList.remove(
        "grid",
        "grid-cols-1",
        "gap-4",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "xl:grid-cols-4"
    );

    // Add classes to style the 'no plants' message
    noMessagesDiv.classList.add(
        "flex",
        "flex-col",
        "w-full",
        "h-full",
        "items-center",
        "place-content-center"
    );

    // Create an image element for the 'no plants' message
    const noMessagesImg = document.createElement("img");
    noMessagesImg.src = "/images/no_plant.svg";
    noMessagesImg.classList.add("w-[400px]");

    // Create a text element for the 'no plants' message
    const noMessagesText = document.createElement("div");
    noMessagesText.classList.add("text-3xl", "text-gray-500", "mt-10");
    noMessagesText.textContent = "No Plants Added";

    // Append the image and text to the message div
    noMessagesDiv.appendChild(noMessagesImg);
    noMessagesDiv.appendChild(noMessagesText);

    // Append the message div to the container
    plantContainer.appendChild(noMessagesDiv);
  } else {
    // If plants exist, iterate through the list and create a card for each plant
    plantList.forEach(function (plant) {
      const card = createCard(plant);
      plantContainer.appendChild(card);
    });
  }
}

// Function to create a card element for a plant
function createCard(plant) {
  var card = document.createElement("div");

  // Check if the plant photo is available, otherwise use a placeholder image
  if (plant.photo.type) {
    plant.photo = "images/offline_image_uploaded.svg";
  } else {
    plant.photo = "images/uploads/" + plant.photo;
  }

  // Add classes to style the card
  card.className = "card shadow-lg bg-white cursor-pointer";

  // Set the onclick event to show the plant's detail page
  card.onclick = function () {
    showDetailsPage(plant._id); // Call the function to show details page
  };

  // Create an image element for the plant photo
  var image = document.createElement("img");
  image.src = plant.photo;
  image.alt = plant.photo;

  // Set the placeholder image if the photo fails to load
  image.onerror = function () {
    this.onerror = null;
    this.src = placeHolderImage;
  };

  // Add classes to style the image
  image.className = "w-full h-48 object-contain border-b-2 shadow-3";

  // Create a div for the details of the plant
  var details = document.createElement("div");
  details.className = "p-4";

  // Create and set the plant name
  var title = document.createElement("h3");
  title.className = "text-lg font-medium text-gray-800";
  title.textContent = plant.plantName;

  // Create and set the plant location
  var location = document.createElement("p");
  location.className = "text-gray-600";
  location.textContent = "Location: " + plant.location;

  // Create and set the plant date/time
  var dateTime = document.createElement("p");
  dateTime.className = "text-gray-600";
  dateTime.textContent = "Date/Time: " + plant.date;

  // Append the details to the card
  details.appendChild(title);
  //details.appendChild(location);
  details.appendChild(dateTime);
  card.appendChild(image);
  card.appendChild(details);

  // Return the constructed card element
  return card;
}
