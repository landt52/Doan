const csv = require('csvtojson');
const multer = require('multer');
const fs = require('fs');
const Province = require('./../models/provincesModel');
const AppError = require('./../Error');
const catchAsync = require('./../catchAsync');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'models');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    if (
      ['csv', 'txt'].indexOf(
        file.originalname.split('.')[file.originalname.split('.').length - 1]
      ) === -1
    ) {
      return next(new AppError('Sai đuôi file', 404));
    }
    callback(null, true);
  }
}).single('file');

const convertType = value => {
  const v = Number(value);
  return !isNaN(v)
    ? v
    : value === 'undefined'
    ? undefined
    : value === 'null'
    ? null
    : value === 'true'
    ? true
    : value === 'false'
    ? false
    : value;
};

exports.uploadProvincesModel = async (req, res, next) => {
  await upload(req, res, async err => {
    if (!req.file) {
      return next(new AppError('Không có file', 500));
    }
    if (err instanceof multer.MulterError) {
      return next(new AppError('Có lỗi xảy ra khi đọc file', 500));
    } else if (err) {
      return next(new AppError('Có lỗi xảy ra', 500));
    }
    if (req.file && req.body.chooseType === 'Map') {
      try {
        await csv()
          .fromFile(req.file.path)
          .then(async jsonObj => {
            let obj = await jsonObj.reduce((acc, cur) => {
              acc[Object.values(cur)[0]] = Object.values(cur)[1];
              return acc;
            }, {});
            obj[Object.keys(jsonObj[0])[1]] = Object.keys(jsonObj[0])[0];
            const key = 'Mã tỉnh';
            const { [key]: _,  ...newObj } = obj;
            await Province.findByIdAndUpdate(
              req.params.provinceID,
              { data: newObj },
              {
                new: true
              }
            );
          });
        await fs.unlink(req.file.path);
        res.status(200).send({ status: 'success' });
      } catch (error) {
        await fs.unlink(req.file.path);
        return next(new AppError('Có lỗi xảy ra khi đọc file', 500));
      }
    }
    else if (req.file && req.body.chooseType === 'Info' && convertType(req.body.chooseValue)) {
      try {
        await csv()
          .fromFile(req.file.path)
          .then(async jsonObj => {
            const obj = {};
            obj[
              Object.keys(jsonObj[0])[Object.keys(jsonObj[0]).length - 1]
            ] = Object.keys(jsonObj[0]).slice(0, -1);

            const restObj = await jsonObj.reduce((acc, cur) => {
              acc[
                Object.values(cur)[Object.values(cur).length - 1]
              ] = Object.values(cur).slice(0, -1);
              return acc;
            }, {});

            const newObj = {};
            newObj[req.body.chooseValue] = Object.assign({}, obj, restObj);

            await Province.findOneAndUpdate(
              {_id: req.params.provinceID},
              {"$push": {"tables": newObj}}
            )
          });
        await fs.unlink(req.file.path);
        res.status(200).send({ status: 'success' });
      } catch (error) {
        await fs.unlink(req.file.path);
        return next(new AppError('Có lỗi xảy ra khi đọc file', 500));
      }
    }else{
      await fs.unlink(req.file.path);
      return next(new AppError('Hãy điền tên dữ liệu', 500));
    }
  });
};

const uploadPic = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    if (
      ['png', 'jpeg', 'jpg'].indexOf(
        file.originalname.split('.')[file.originalname.split('.').length - 1]
      ) === -1
    ) {
      return next(new AppError('Sai đuôi file', 404));
    }
    callback(null, true);
  }
}).single('file');

exports.uploadProvincePicture = async (req, res, next) => {
  await uploadPic(req, res, async err => {
    if (!req.file) {
      return next(new AppError('Không có file', 500));
    }
    if (err instanceof multer.MulterError) {
      return next(new AppError('Có lỗi xảy ra khi đọc file', 500));
    } else if (err) {
      return next(new AppError('Có lỗi xảy ra', 500));
    }
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        await fs.unlink(req.file.path);
        res.status(200).send({ url: result.secure_url });
      } catch (error) {
        await fs.unlink(req.file.path);
        return next(new AppError('Có lỗi xảy ra khi đọc file', 500));
      }
    }
  });
};

exports.editProvinceModel = catchAsync(async (req, res, next) => {
  await Province.findByIdAndUpdate(
    req.params.provinceID,
    { info: req.body.infoData },
    {
      new: true
    }
  );
  res.status(200).send({ status: 'success' });
})
