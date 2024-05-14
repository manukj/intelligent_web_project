const plantModel = require("../models/plant");
const { ObjectId } = require("mongodb");
const { response } = require("express");
exports.detailsPage = async (req, res, next) => {
  const plantModel = require("../models/plant");
  const user_name = req.params.user_name;
  const plant_name = req.params.plant_name;
  var dbpediaResult = await getPlantDetails(plant_name);
  try {
    const data = await plantModel.findById(req.params.plant_id);
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

exports.searchPlant = async (req, res, next) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.results.bindings.length > 0) {
        let bindings = data.results.bindings;
        let result = JSON.stringify(bindings);
        console.log(data);
        console.log(result);
      } else {
      }
    })
    .catch((error) => {});
};
