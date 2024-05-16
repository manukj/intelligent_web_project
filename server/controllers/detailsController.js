const { ObjectId } = require("mongodb");
const { response } = require("express");
const AddPlant = require("../models/add_plant_model");
async function getPlant(plant_id) {
  try{
    const plant = AddPlant.findOne({_id:plant_id});
    return plant;
  }catch (e) {
    return null;
  }
}

async function getMap(plant) {
  try{
    const parts = plant.location.split(',');
    const latitude = parts[0].trim();
    const longtitude = parts[1].trim();
    const link = `https://www.google.com/maps?q=${latitude},${longtitude}`
    return link;
  }catch (e) {
    return null;
  }
}

exports.detailsPage = async (req, res, next) => {
  const user_name = req.params.user_name;
  const plant = await getPlant(req.params.plant_id);
  console.log(plant);
  const resource = `http://dbpedia.org/resource/`+plant.plantName;
  var dbpediaResult = await getPlantDetails(plant.plantName);
  const link = await getMap(plant);
  try {
    const data = await getPlant(req.params.plant_id);
    console.log("1");
    console.log(data);
    console.log("2");
    console.log(dbpediaResult)
    res.render("details/details", {
      data,
      user_name: user_name,
      dbpediaResult: dbpediaResult,
      resource:resource,
      link:link,
    });
  } catch (e) {
    console.error(e);
    res.status(404).send();
  }
};

async function getPlantDetails(plantName) {
  const resource = `http://dbpedia.org/resource/${encodeURIComponent(
      plantName
  )}`;
  console.log(resource);
  const endpointUrl = "https://dbpedia.org/sparql";

  const sqarqlQuery = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT ?name ?description WHERE {
      <${resource}> rdfs:label ?name .
      <${resource}> rdfs:comment ?description .
      FILTER (langMatches(lang(?name), "en")) .
      FILTER (langMatches(lang(?description), "en")) .
    }`;

  const encodedQuery = encodeURIComponent(sqarqlQuery);
  const url = `${endpointUrl}?query=${encodedQuery}&format=json`;
  var result;
  try {
    result = await fetch(url).then((response) => response.json());
    console.log(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
  return result;
}


