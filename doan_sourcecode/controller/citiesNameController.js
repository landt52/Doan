const database = require('../database');
const catchAsync = require('../catchAsync');
const AppError = require('../Error');
const Province = require('../models/provincesModel');

exports.getCitiesName = catchAsync(async (req, res, next) => {
  const results = await database.getAllCitiesName();
  const province = await Province.find();
  if (results.length === 0) {
    return next(new AppError('Không tìm thấy', 404));
  }
  const cities = results.map((row, idx) => {
    let city = { name: row.adm1_name, id: row.id, lat: row.lat, lng: row.lng, _id: province[idx]._id };
    return city;
  });
  res.status(200).send({ status: 'success', cities });
});
