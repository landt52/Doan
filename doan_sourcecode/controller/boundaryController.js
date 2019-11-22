const database = require('./../database');
const District = require('./../models/districtModel');
const Province = require('./../models/provincesModel');
const AttributeIcon = require('./../models/attributeType');
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
  const district = District.find({ provincename: provinceBoundary }, {districtname: 1, data:1, id: 1});
  const provincename = Province.find({ provincename: provinceBoundary}, {realname: 1})

  const data = await Promise.all([results, district, provincename])
  if (data[0].length === 0 || data[1].length === 0) {
    return next(new AppError('Không tìm thấy', 404))
  }

  const boundaries = data[0].map((row, idx) => {
    let geojson = JSON.parse(row.st_asgeojson);
    geojson.id = row.id;
    geojson.provincename = data[2];
    geojson.properties = { name: row.adm2_name_ };
    geojson.properties.data = { something: data[1].filter(d => d.id == row.id)[0].data };
    return geojson;
  });

  res.status(200).send({ status: 'success', boundaries });
});

exports.getIcons = catchAsync(async (req, res, next) => {
  const icons = await AttributeIcon.findById('5dd75b7aa17ec1334cfe6167');
  res.status(200).json({
    status: 'success',
    icons: icons.icon
  })
})

exports.getIconsName = catchAsync(async (req, res, next) => {
  const icons = await AttributeIcon.findById('5dd75b7aa17ec1334cfe6167');
  res.status(200).json({
    status: 'success',
    icons: icons
  });
});

exports.updateIcons = catchAsync(async (req, res, next) => {
  const icons = await AttributeIcon.findByIdAndUpdate(
    '5dd75b7aa17ec1334cfe6167', {
      icon: req.body.icon
    }
  );
  res.status(200).json({
    status: 'success'
  })
})
