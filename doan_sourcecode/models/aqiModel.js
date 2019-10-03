const mongoose = require('mongoose');

const aqiSchema = new mongoose.Schema({
  name: {
    type: String
  },
  aqi: {
    type: Number
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number]
  }
});

const Aqi = mongoose.model('Aqi', aqiSchema);

module.exports = Aqi;