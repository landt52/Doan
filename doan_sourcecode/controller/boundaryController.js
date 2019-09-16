const database = require('../database');
const District = require('../models/districtModel');
const catchAsync = require('../catchAsync');
const AppError = require('../Error');

exports.getVnBoundaries = catchAsync(async (req, res, next) => {
  const results = await database.getCityBoundaries();
  if (results.length === 0) {
    return next(new AppError('Không tìm thấy', 404));
  }
  const boundaries = results.map(row => {
    let geojson = JSON.parse(row.st_asgeojson);
    geojson.id = row.id;
    geojson.properties = { name: row.adm1_name };
    return geojson;
  });
  res.status(200).send({ status: 'success', boundaries });
});

exports.getProvinceBoundary = catchAsync(async (req, res, next) => {
  const provinceBoundary = req.params.provinceBoundary;

  let district = await District.find({ provincename: provinceBoundary });

  const results = await database.getDistrictBoundaries(provinceBoundary);
  if (results.length === 0) {
    return next(new AppError('Không tìm thấy', 404))
  }

  const boundaries = results.map((row, idx) => {
    let geojson = JSON.parse(row.st_asgeojson);
    geojson.id = row.id;
    geojson.properties = { name: row.adm2_name_ };
    geojson.properties.data = { something: district[idx].data };
    return geojson;
  });

  res.status(200).send({ status: 'success', boundaries });
});
