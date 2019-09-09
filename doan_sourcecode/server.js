const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require('dotenv').config();

const database = require('./database');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

app.get('/api/vnBoundaries', async (req, res) => {
    const results = await database.getCityBoundaries();
   	if (results.length === 0) { res.status(404).json("NOT FOUND"); }
    const boundaries = results.map((row) => {
        let geojson = JSON.parse(row.st_asgeojson);
        geojson.properties = { name: row.adm1_name, id: row.id };
        return geojson;
    })
    res.status(200).send({status: "success", boundaries});
})

app.get('/api/vnBoundaries/:provinceBoundary', async (req, res) => {
  const provinceBoundary = req.params.provinceBoundary;
  const results = await database.getDistrictBoundaries(provinceBoundary);
  if (results.length === 0) {
    res.status(404).json('NOT FOUND');
  }
  const boundaries = results.map(row => {
    let geojson = JSON.parse(row.st_asgeojson);
    geojson.properties = { name: row.adm2_name_, id: row.id };
    return geojson;
  });
  res.status(200).send({status: "success", boundaries});
});

app.get('/api/citiesName', async (req, res) => {
  const results = await database.getAllCitiesName();
  if (results.length === 0) {
    res.status(404).json('NOT FOUND');
  }
  const cities = results.map(row => {
    let city = {name: row.adm1_name, id: row.id, lat: row.lat, lng: row.lng};
    return city;
  });
  res.status(200).send({status: "success", cities});
})

app.listen(port, err => {
    if(err) throw err;
    console.log('Server is running at port ' + port)
});