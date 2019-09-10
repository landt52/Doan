const District = require('../models/districtModel');

exports.getDistrictsName = async (req, res) => {
  try {
      let district = await District.find({}, { districtname: 1 });
      if (district.length === 0) {
        res.status(404).json('NOT FOUND');
      }
      res.status(200).send({ status: 'success', district });
  } catch (error) {
      res.status(404).json('NOT FOUND');
  }
};
