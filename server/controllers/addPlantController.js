const AddPlant = require("../models/add_plant_model"); // Import the AddPlant model

exports.addAPlantPage = async (req, res, next) => {
  res.render("add_plant/add_plant", { title: "Add A Plant" });
};

exports.addImage = async (req, res, next) => {
  console.log("req.file", req.file);
  res.json({ message: "Image uploaded successfully" });
};

exports.addNewPlantToDb = async (req, res, next) => {
  const plantData = req.body;
  let photoPath = null;

  if (req.file && req.file.path) {
    photoPath = req.file.path; // Store the image file name
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
