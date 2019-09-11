const database = require('../database');
const District = require('../models/districtModel');

exports.getVnBoundaries = async (req, res) => {
  try {
    const results = await database.getCityBoundaries();
    if (results.length === 0) {
      res.status(404).json('NOT FOUND');
    }
    const boundaries = results.map(row => {
      let geojson = JSON.parse(row.st_asgeojson);
      geojson.id = row.id;
      geojson.properties = { name: row.adm1_name };
      return geojson;
    });
    res.status(200).send({ status: 'success', boundaries });
  } catch (error) {
    res.status(404).json('NOT FOUND');
  }
};

exports.getProvinceBoundary = async (req, res) => {
  try {
    const provinceBoundary = req.params.provinceBoundary;

    let district = await District.find({provincename: provinceBoundary});

    const results = await database.getDistrictBoundaries(provinceBoundary);
    if (results.length === 0) {
      res.status(404).json('NOT FOUND');
    }

    const boundaries = results.map((row, idx) => {
      let geojson = JSON.parse(row.st_asgeojson);
      geojson.id = row.id;
      geojson.properties = { name: row.adm2_name_ };
      geojson.properties.data = {something: district[idx].data}
      return geojson
    });

    res.status(200).send({ status: 'success', boundaries });
  } catch (error) {
    res.status(404).json('NOT FOUND');
  }
};
