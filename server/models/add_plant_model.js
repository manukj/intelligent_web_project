let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AddPlantSchema = new Schema({
    plantName: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String,},
    description: { type: String, required: true },
    height: { type: Number, required: true, min: 0 },
    spread: { type: Number, required: true, min: 0 },
    characteristics: [{ type: String }],
    flowerColor: { type: String },
    sunExposure: { type: String, enum: ["full", "partial", "shade"] },
    photo: { type: String },
    user: { type: String, required: true },
});

// Create the mongoose model 'addPlant' based on the defined schema
let AddPlant = mongoose.model("addPlants", AddPlantSchema);

module.exports = AddPlant;
