const plantModel = require("../models/plant");
const { ObjectId } = require("mongodb");
const {response} = require("express");
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
exports.searchPlant = async (req, res, next) => {
  const plantName = req.query.plantName;

  const resource = `http://dbpedia.org/resource/${encodeURIComponent(plantName)}`;
  const endpointUrl = 'https://dbpedia.org/sparql';

  const sqarqlQuery=`
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT ?name ?description WHERE {
      <${resource}> rdfs:label ?name .
      <${resource}> rdfs:comment ?description .
      FILTER (langMatches(lang(?name), "en")) .
      FILTER (langMatches(lang(?description), "en")) .
    }`;

  const encodedQuery = encodeURIComponent(sqarqlQuery);
  const url= `${endpointUrl}?query=${encodedQuery}&format=json`;

  fetch(url).then(response=>response.json())
      .then(data=>{
        if (data.results.bindings.length > 0) {
          let bindings = data.results.bindings;
          let result = JSON.stringify(bindings);
          console.log(data)
          console.log("11111111111111")
          console.log(result)
          res.render('details/details', {
            plantName: bindings[0].name.value,
            description: bindings[0].description.value,
            JSONresult: result
          });
        } else {
          res.render('details/details', {
            name: 'No results found',
            description: 'Try a different plant name',
            JSONresult: null
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.render('result', {
          name: 'Error',
          description: 'Failed to fetch data'
        });
      });
};
