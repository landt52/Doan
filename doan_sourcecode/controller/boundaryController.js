const database = require('./../database');
const District = require('./../models/districtModel');
const Province = require('./../models/provincesModel');
const catchAsync = require('./../catchAsync');
const AppError = require('./../Error');

exports.getVnBoundaries = catchAsync(async (req, res, next) => {
  const results = database.getCityBoundaries();

  const province = Province.find({}, {data: 1, id: 1});

  const data = await Promise.all([results, province])
  const provinceData = data[1].reduce(
    (acc, cur) => Object.assign(acc, { [cur.id]: cur.data }),
    {}
  );

  if (data[0].length === 0 || data[1].length === 0) {
    return next(new AppError('Không tìm thấy', 404));
  }
  const boundaries = data[0].map(row => {
    let geojson = JSON.parse(row.st_asgeojson);
    geojson.id = row.id;
    geojson.properties = { name: row.adm1_name };
    geojson.properties.data = { something: provinceData[parseInt(row.id)] };
    return geojson;
  });
  res.status(200).send({ status: 'success', boundaries });
});

exports.getProvinceBoundary = catchAsync(async (req, res, next) => {
  const provinceBoundary = req.params.provinceBoundary;

  const results = database.getDistrictBoundaries(provinceBoundary);
  const district = District.find({ provincename: provinceBoundary }, {districtname: 1, data:1});

  const data = await Promise.all([results, district])

  if (data[0].length === 0 || data[1].length === 0) {
    return next(new AppError('Không tìm thấy', 404))
  }

  const boundaries = data[0].map((row, idx) => {
    let geojson = JSON.parse(row.st_asgeojson);
    geojson.id = row.id;
    geojson.properties = { name: row.adm2_name_ };
    geojson.properties.data = { something: data[1][idx].data };
    return geojson;
  });

  res.status(200).send({ status: 'success', boundaries });
});
