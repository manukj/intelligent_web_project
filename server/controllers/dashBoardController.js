// Import the add_plant_model which represents the dashboardPage model
const dashboardPage = require("../models/add_plant_model");

// Controller function to render the dashboard page
exports.dashboardPage = async (req, res, next) => {
  // Render the dashboard view with a title
  res.render("dashboard/dashboard", {
    title: "Dashboard",
  });
};

// Controller function to get all plant details from the database
exports.getAllPlantDetails = async (req, res, next) => {
  console.log("Getting all plants...");

  // Use the dashboardPage model to find all plant documents
  return dashboardPage
      .find({})
      .then((plants) => {
        // Log the retrieved plants for debugging purposes
        console.log("Plants retrieved successfully! :", JSON.stringify(plants));

        // Send the retrieved plants as a JSON response
        res.json(plants);
      })
      .catch((err) => {
        // Log an error message if there was an issue retrieving the plants
        console.error("Error retrieving plants: ", err);

        // Send an error message as a JSON response
        res.json("Error retrieving plants: ");
      });
};
