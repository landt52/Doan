const csv = require('csvtojson');
const multer = require('multer');
const fs = require('fs');
const Province = require('../models/provincesModel');
const AppError = require('../Error');

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
    if (req.file) {
      try {
        await csv()
          .fromFile(req.file.path)
          .then(async jsonObj => {
            console.log(jsonObj)
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
        fs.unlinkSync(req.file.path);
        res.status(200).send({ status: 'success' });
      } catch (error) {
        fs.unlinkSync(req.file.path);
        return next(new AppError('Có lỗi xảy ra khi đọc file', 500));
      }
    }
  });
};
