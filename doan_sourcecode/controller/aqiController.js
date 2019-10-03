const Aqi = require('../models/aqiModel');
const catchAsync = require('../catchAsync');
const AppError = require('../Error');
const axios = require('axios');

exports.updateAqi = catchAsync(async (req, res, next) => {
    const aqiData = await axios(
      'https://website-api.airvisual.com/v1/places/map?bbox=86.42707612905815,5.888532395680404,126.17121782694176,26.833221310998145&units.temperature=celsius&units.distance=kilometer&AQI=US&language=en'
    );

    const newData = aqiData.data.map(({id, type, coordinates, ...data}) => {
      let [lat, lng] = Object.values(coordinates);
      [lat, lng] = [lng, lat];
      return {
        ...data,
        location: {
          type: "Point",
          coordinates: [lat, lng]
        }
      }
    })
    await Aqi.deleteMany()
    await Aqi.insertMany(newData);
})

exports.getAqi = catchAsync(async (req, res, next) => {
    const aqiData = await Aqi.find();

    if(aqiData.length === 0){
      return next(new AppError('Không tìm thấy chỉ số Aqi', 404))
    }
    const aqi = aqiData.map(row => {
      let geojson = row.location;
      geojson = {...geojson, id: row.id, properties: {name: row.name, aqi: row.aqi}};
      return geojson;
    })
    res.status(200).send({status: 'success', aqi: aqi})
})