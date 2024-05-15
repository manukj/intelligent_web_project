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

exports.detailsPage = async (req, res, next) => {
  const user_name = req.params.user_name;
  console.log(req.params.plant_id)
  const plant = await getPlant(req.params.plant_id);
  console.log(plant);
  var dbpediaResult = await getPlantDetails(plant.plantName);
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


