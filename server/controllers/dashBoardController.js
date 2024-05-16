const dashboardPage = require("../models/add_plant_model");
exports.dashboardPage = async (req, res, next) => {
  res.render("dashboard/dashboard", {
    title: "Dashboard",
  });
};

exports.getAllPlantDetails = async (req, res, next) => {
  console.log("Getting all plants...");

  return dashboardPage
    .find({})
    .then((plants) => {
      console.log("Plants retrieved successfully! :", JSON.stringify(plants));
      res.json(plants);
    })
    .catch((err) => {
      console.error("Error retrieving plants: ", err);
      res.json("Error retrieving plants: ");
    });
};
