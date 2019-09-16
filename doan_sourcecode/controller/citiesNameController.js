const database = require('../database');
const catchAsync = require('../catchAsync');
const AppError = require('../Error');

exports.getCitiesName = catchAsync(async (req, res, next) => {
  const results = await database.getAllCitiesName();
  if (results.length === 0) {
    return next(new AppError('Không tìm thấy', 404));
  }
  const cities = results.map(row => {
    let city = { name: row.adm1_name, id: row.id, lat: row.lat, lng: row.lng };
    return city;
  });
  res.status(200).send({ status: 'success', cities });
});
