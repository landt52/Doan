const csv = require('csvtojson');
const multer = require('multer');
const fs = require('fs');
const District = require('../models/districtModel');
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

exports.uploadDistrictsModel = async (req, res, next) => {
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
              let obj = await jsonObj.reduce((acc, cur) => {
                if(Array.isArray(Object.values(cur)[0])){
                  acc[Object.values(cur)[1]] = Object.values(cur)[0].pop();
                }
                else if (typeof Object.values(cur)[0] === 'string'){
                  acc[Object.values(cur)[1]] = Object.values(cur)[0];
                } else {
                  acc[Object.values(cur)[1]] = Object.values(
                    Object.values(cur)[0]
                  )[0];
                }
                return acc;
              }, {});
              obj[Object.keys(jsonObj[0])[1]] = Object.keys(jsonObj[0])[0];
              const key1 = 'Mã huyện';
              const key2 = 'Mã tỉnh';
              const {[key1]: _,[key2]: __, ...newObj} = obj;
              await District.findByIdAndUpdate(req.params.districtID, {data: newObj}, {
                  new: true
              })
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