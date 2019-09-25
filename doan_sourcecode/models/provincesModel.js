const mongoose = require('mongoose');

const provinceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, '1 quan-huyen can co id'],
    unique: true
  },
  provincename: {
    type: String,
    required: [true, 'Quoc gia can co tinh - thanh pho']
  },
  data: {
    type: Object
  },
  info: {
    type: String
  },
  summary: {
    type: Object
  },
  image: {
    type: [String]
  },
  imageID: {
    type: [String]
  }
});

const Province = mongoose.model('Province', provinceSchema);

module.exports = Province;
