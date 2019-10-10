const Province = require('./../models/provincesModel');
const catchAsync = require('./../catchAsync');
const AppError = require('./../Error');

exports.getProvinceInfo = catchAsync(async (req, res, next) => {
    let provinceData = await Province.findById(req.params.provinceID, {info: 1, tables: 1})
    if (provinceData.length === 0) {
      return next(new AppError('Không tìm thấy', 404));
    }
    res.status(200).send({ status: 'success', provinceData });
})
