const Aqi = require('./../models/aqiModel');
const Weather = require('./../models/weatherModel');
const catchAsync = require('./../catchAsync');
const AppError = require('./../Error');
const axios = require('axios');
const database = require('./../database');

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
    console.log('Aqi Done')
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

exports.updateWeather = catchAsync(async (req, res, next) => {
    const results = await database.getAllCitiesName();
    const promises = results.map(async ({lat, lng, adm1_name}) => {
        const response = await axios(
          `https://api.darksky.net/forecast/${process.env.DARKSKY_API_SECRET}/${lat},${lng}?units=si&exclude=daily,flags`
        );

        return {
          location: {
            type: 'Point',
            coordinates: [response.data.longitude, response.data.latitude]
          },
          name: adm1_name,
          summary: response.data.hourly.summary,
          icon: response.data.currently.icon,
          temp: response.data.currently.temperature,
          data: response.data.hourly.data.map(({time, summary, icon, temperature}) => ({
            time: convertUnixToUTC7(time),
            unixTime: time,
            summary,
            icon,
            temperature
          }))
        };
    })
    const newData = await Promise.all(promises);

    await Weather.deleteMany();
    await Weather.insertMany(newData);
    console.log('Weather Done');
});

convertUnixToUTC7 = (time) => {
    const months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const date = new Date(time * 1000);
    const year = date.getFullYear();
    const month = months_arr[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();

    return `${month}-${day}-${year} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
}

exports.updateWeatherHourly = catchAsync(async (req, res, next) => {
    const currentUnix = Math.floor(Date.now() / 1000);
    const weatherData = await Weather.find();

    const newData = weatherData.map(({data, location, name}) => {
        let currentTemp, currentSummary, currentIcon;
        for(let i = 0; i <= data.length - 1; i++){
          if(currentUnix <= data[i].unixTime){
            currentTemp = data[i-1].temperature;
            currentSummary = data[i-1].summary;
            currentIcon = data[i-1].icon;
            break;
          }
        }
        return {
          location,
          name,
          data,
          temp: currentTemp,
          summary: currentSummary,
          icon: currentIcon
        };
    })

    await Weather.deleteMany();
    await Weather.insertMany(newData);
    console.log('Update Weather Done');
})

exports.getWeather = catchAsync(async (req, res, next) => {
    const weatherData = await Weather.find();

    if (weatherData.length === 0) {
      return next(new AppError('Không tìm thấy thông tin thời tiết', 404));
    }

    const weather = weatherData.map(row => {
      let geojson = row.location;
      geojson = {
        ...geojson,
        id: row.id,
        properties: { summary: row.summary, icon: row.icon, data: row.data, name: row.name, temp: row.temp }
      };
      return geojson;
    });

    res.status(200).send({ status: 'success', weather});
});
