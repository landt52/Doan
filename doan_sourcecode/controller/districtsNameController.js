const District = require('../models/districtModel');
const catchAsync = require('../catchAsync');
const AppError = require('../Error');

exports.getDistrictsName = catchAsync(async (req, res, next) => {
  let district = await District.find({}, { districtname: 1 });
  if (district.length === 0) {
    return next(new AppError('Không tìm thấy', 404));
  }
  res.status(200).send({ status: 'success', district });
});
