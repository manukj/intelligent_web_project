const dashboardPage = require("../models/add_plant_model");
exports.dashboardPage = async (req, res, next) => {
  // TODO : make Api call here to get the plant data

  const plantData = [
    {
      name: "Angel trumpet",
      location: "Garden",
      date: "2022-10-01",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/AngelTrumpet_Mounts_Asit.jpg/2560px-AngelTrumpet_Mounts_Asit.jpg",
    },
    {
      name: "Angel trumpet",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/AngelTrumpet_Mounts_Asit.jpg/2560px-AngelTrumpet_Mounts_Asit.jpg",
    },
    // Add more plant details as needed
  ];

  // Use the plantData array in your code
  res.render("dashboard/dashboard", {
    title: "Dashboard",
    plantData: plantData,
  });
};

exports.getAllPlantDetails = async (req, res, next) => {

  console.log("Getting all plants...");

  return dashboardPage.find({})
      .then((plants) => {
        console.log(
            "Plants retrieved successfully! :",
            JSON.stringify(plants)
        );
        res.json(plants);
      })
      .catch((err) => {
        console.error("Error retrieving plants: ", err);
        res.json("Error retrieving plants: ");
      });
};