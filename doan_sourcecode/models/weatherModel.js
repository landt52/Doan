const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number]
  },
  name: {
      type: String
  },
  summary: {
      type: String
  },
  icon: {
      type: String
  },
  temp: {
      type: String
  },
  data: {
      type: [Object]
  }
});

const Weather = mongoose.model('Weather', weatherSchema)

module.exports = Weather
