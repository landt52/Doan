const csv = require('csvtojson');
const multer = require('multer');
const fs = require('fs');
const District = require('../models/districtModel');

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
      return callback(new Error('Wrong extension type'));
    }
    callback(null, true);
  }
}).single('file');

exports.uploadDistrictsModel = async (req, res) => {
  await upload(req, res, async err => {
    if (!req.file) {
      return res.status(500).json(err);
    }
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    if (req.file) {
      try {
          await csv()
            .fromFile(req.file.path)
            .then(async jsonObj => {
              let obj = await jsonObj.reduce((acc, cur) => {
                acc[Object.values(cur)[1]] = Object.values(cur)[0].pop();
                return acc;
              }, {});
              obj[Object.keys(jsonObj[0])[1]] = Object.keys(jsonObj[0])[0];
              const newDistrictData = await District.findByIdAndUpdate(req.params.districtID, {data: obj}, {
                  new: true
              })
              console.log(newDistrictData);
            });
            fs.unlinkSync(req.file.path);
            res.status(200).send({ status: 'success' });
      } catch (error) {
          fs.unlinkSync(req.file.path);
          res.status(500).send({ error });
      }    
    }
  });
};