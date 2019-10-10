const database = require('./../database');
const catchAsync = require('./../catchAsync');
const AppError = require('./../Error');
const Province = require('./../models/provincesModel');

exports.getCitiesName = catchAsync(async (req, res, next) => {
  const results = database.getAllCitiesName();
  const province = Province.find({}, {_id: 1});

  const data = await Promise.all([results, province])

  if (data[0].length === 0 || data[1].length === 0) {
    return next(new AppError('Không tìm thấy', 404));
  }
  const cities = data[0].map((row, idx) => {
    let city = { name: row.adm1_name, id: row.id, lat: row.lat, lng: row.lng, _id: data[1][idx]._id };
    return city;
  });
  res.status(200).send({ status: 'success', cities });
});
