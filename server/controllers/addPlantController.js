const AddPlant = require("../models/add_plant_model");
const ChatMessage = require("../models/chat_model");

/**
 * Renders the add plant page.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.addAPlantPage = async (req, res, next) => {
  res.render("add_plant/add_plant", {
    title: "Add A Plant",
  });
};

/**
 * Adds a new plant to the database.
 * @param {object} req - The request object containing plant data.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise} - A promise that resolves to the newly added plant.
 */
exports.addNewPlantToDb = async (req, res, next) => {
  const plantData = req.body;
  let photoPath = null;

  // Check if there's a photo associated with the plant
  if (req.file && req.file.filename) {
    photoPath = req.file.filename;
  }

  // Create a new plant instance with provided data
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

  // Save the new plant to the database
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
 * @param {object} req - The request object containing the plant ID and new plant name.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.editPlantName = async (req, res, next) => {
  const plantId = req.params.plant_id;
  const { newPlantName } = req.body;

  try {
    console.log("Editing plant name: ", plantId, newPlantName);

    // Find and update the plant's name in the database
    const updatedPlant = await AddPlant.findByIdAndUpdate(
        plantId,
        { plantName: newPlantName },
        { new: true }
    );
    console.log("Plant updated with new name: ", updatedPlant);

    // Update chat messages associated with the plant
    const result = await ChatMessage.updateMany(
        { plant_id: plantId },
        { $set: { "suggested_name.isApprovedByOwner": true } }
    );
    console.log("Updated chat messages: ", result);

    // Check if plant and chat messages were updated successfully
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
