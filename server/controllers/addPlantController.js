const AddPlant = require('../models/add_plant_model'); // Import the AddPlant model

exports.addAPlantPage = async (req, res, next) => {
  res.render("add_plant/add_plant", { title: "Add A Plant" });
};

exports.addNewPlantToDb = async (req, res, next) => {
  const plantData = req.body;
  let photoPath = null;

  // Check if a file was uploaded and if it has a valid filename
  console.log("testt------")
  console.log(req.file);
  // console.log(req.file.filename);
  // console.log(req.file.path);
  if (req.file && req.file.filename) {
    photoPath = req.file.filename; // Store the image file name
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