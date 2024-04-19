const plantModel = require("../models/plant");
const {ObjectId} = require("mongodb");
exports.detailsPage = async (req, res, next) => {
  const plantModel = require('../models/plant')
  try{
    //const objectId = new ObjectId('661d8b6d3a01bb4d256767db');
    //const data = await plantModel.findById(objectId);
    // const data = await plantModel.findAll();
    // const data = await plantModel.findById('12345');
    const data = await plantModel.findById(req.query._id);
    console.log(data);
    res.render('details/details',{data});
  }catch (e) {
    console.error(e);
    res.status(404).send();
  }
};
exports.savePlant = async (req, res, next) => {
  const plantModel = require('../models/plant')
  try{
    const newPlant = await plantModel.save(req.body);
    res.status(201).json(newPlant);
  }catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
