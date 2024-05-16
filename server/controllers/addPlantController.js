const AddPlant = require("../models/add_plant_model");
const ChatMessage = require("../models/chat_model");

/**
 * Renders the add plant page.
 */
exports.addAPlantPage = async (req, res, next) => {
  res.render("add_plant/add_plant", {
    title: "Add A Plant",
    user: req.params.user_name,
  });
};

/**
 * Adds a new plant to the database.
 * @returns {Promise} - A promise that resolves to the newly added plant.
 */
exports.addNewPlantToDb = async (req, res, next) => {
  const plantData = req.body;
  let photoPath = null;

  if (req.file && req.file.fileName) {
    photoPath = req.file.fileName;
  }
  const newPlant = new AddPlant({
    plantName: plantData.plantName,
    date: plantData.date,
    location: plantData.location,
    description: plantData.description,
    height: plantData.height,
    spread: plantData.spread,
    characteristics: plantData.characteristics,
    flowerColor: plantData.flowerColor,
    sunExposure: plantData.sunExposure,
    photo: photoPath,
    user: plantData.user,
  });

  console.log("Adding new plant: ", newPlant);
  return newPlant
    .save()
    .then((plant) => {
      console.log("Plant added successfully! :", plant);
      res.json(plant);
    })
    .catch((err) => {
      console.error("Error adding plant: ", err);
      return res.status(500).json({
        success: false,
        message: "Error adding plant",
        error: err.message,
      });
    });
};

/**
 * Edits the name of a plant in the database.
 */
exports.editPlantName = async (req, res, next) => {
  const plantId = req.params.plant_id;
  const { newPlantName } = req.body;

  try {
    console.log("Editing plant name: ", plantId, newPlantName);

    const updatedPlant = await AddPlant.findByIdAndUpdate(
      plantId,
      { plantName: newPlantName },
      { new: true }
    );
    console.log("Plant updated with new name: ", updatedPlant);

    const result = await ChatMessage.updateMany(
      { plant_id: plantId },
      { $set: { "suggested_name.isApprovedByOwner": true } }
    );
    console.log("Updated chat messages: ", result);

    if (!updatedPlant && !result) {
      return res
        .status(404)
        .json({ success: false, message: "Plant not found" });
    }

    res.status(200).json({ success: true, plant: updatedPlant });
  } catch (error) {
    console.error("Error editing plant name: ", error);
    res.status(500).json({
      success: false,
      message: "Error editing plant name",
      error: error.message,
    });
  }
};
