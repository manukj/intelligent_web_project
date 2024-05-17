// Importing mongoose library for MongoDB schema modeling
let mongoose = require("mongoose");
// Destructuring Schema object from mongoose
let { Schema } = mongoose;

// Defining a schema for adding plants
let AddPlantSchema = new Schema({
    // Name of the plant, required field
    plantName: { type: String, required: true },
    // Date when the plant was added, required field
    date: { type: Date, required: true },
    // Location where the plant is placed
    location: { type: String,},
    // Description of the plant, required field
    description: { type: String, required: true },
    // Height of the plant in centimeters, required field, minimum value allowed is 0
    height: { type: Number, required: true, min: 0 },
    // Spread of the plant in centimeters, required field, minimum value allowed is 0
    spread: { type: Number, required: true, min: 0 },
    // Characteristics of the plant, can be an array of strings
    characteristics: [{ type: String }],
    // Color of the flower of the plant
    flowerColor: { type: String },
    // Sun exposure requirements for the plant, should be one of 'full', 'partial', or 'shade'
    sunExposure: { type: String, enum: ["full", "partial", "shade"] },
    // URL or path to the photo of the plant
    photo: { type: String },
    // User who added the plant, required field
    user: { type: String, required: true },
});

// Creating a mongoose model named 'addPlants' based on the defined schema
let AddPlant = mongoose.model("addPlants", AddPlantSchema);

// Exporting the AddPlant model for use in other files
module.exports = AddPlant;
