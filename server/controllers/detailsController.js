const plantModel = require("../models/plant");
const { ObjectId } = require("mongodb");
exports.detailsPage = async (req, res, next) => {
  const plantModel = require("../models/plant");
  const user_name = req.params.user_name;
  try {
    const data = await plantModel.findById(req.params.plant_id);
    console.log(data);
    res.render("details/details", { data, user_name: user_name });
  } catch (e) {
    console.error(e);
    res.status(404).send();
  }
};
exports.savePlant = async (req, res, next) => {
  const plantModel = require("../models/plant");
  try {
    const newPlant = await plantModel.save(req.body);
    res.status(201).json(newPlant);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
