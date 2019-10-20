const database = require('./../database');
const catchAsync = require('./../catchAsync');
const AppError = require('./../Error');
const Province = require('./../models/provincesModel');

exports.getCitiesName = catchAsync(async (req, res, next) => {
  const results = database.getAllCitiesName();
  const province = Province.find({}, {_id: 1, id: 1});

  const data = await Promise.all([results, province])

  const provinceData = data[1].reduce((acc, cur) => Object.assign(acc, { [cur.id]: cur._id }), {});

  if (data[0].length === 0 || data[1].length === 0) {
    return next(new AppError('Không tìm thấy', 404));
  }
  const cities = data[0].map(row => {
    let city = {
      name: row.adm1_name,
      id: row.id,
      lat: row.lat,
      lng: row.lng,
      _id: provinceData[parseInt(row.id)]
    };
    return city;
  });
  res.status(200).send({ status: 'success', cities });
});
