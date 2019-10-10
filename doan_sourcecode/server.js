const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require("path");
const AppError = require('./Error');
const errorController = require('./controller/errorController');
const cron = require('cron');
require('dotenv').config();
const aqiController = require('./controller/aqiController'); 

process.on('uncaughtException', err => {
  console.log(err);
  process.exit(1);
});

const DB = process.env.MONGODB.replace(
  '<PASSWORD>',
  process.env.MONGODB_PASSWORD
);
mongoose.connect(DB, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false}).then(() => {
  console.log('DONE')
})

const boundaryRouter = require('./routes/boundaryRoutes');
const citiesNameRouter = require('./routes/citiesNameRoutes');
const districtsNameRouter = require('./routes/districtsNameRoutes');
const uploadDistrictsInfoRouter = require('./routes/uploadDistrictsInfoRoutes');
const uploadProvincesInfoRouter = require('./routes/uploadProvincesInfoRoutes');
const aqiRouter = require('./routes/aqiRoutes');
const weatherRouter = require('./routes/weatherRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 5 * 60 * 1000,
  message: 'Bạn đã gửi quá nhiều request. Hãy thử lại sau 5 phút'
});

app.use('/api', limiter);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp()); 

app.use(cors());
if(process.env.NODE_ENV.trim() === 'development') app.use(morgan('dev'));

app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const aqiJob = new cron.CronJob({
  cronTime: '0 * * * *',
  onTick: function(){
      aqiController.updateAqi();
  },
  start: true,
  timeZone: 'Asia/Ho_Chi_Minh'
});

const weatherJob = new cron.CronJob({
  cronTime: '0 0 * * *',
  onTick: function(){
    aqiController.updateWeather();
  },
  start: true,
  timeZone: 'Asia/Ho_Chi_Minh'
});

const weatherUpdateJob = new cron.CronJob({
  cronTime: '5 * * * *',
  onTick: function() {
    aqiController.updateWeatherHourly();
  },
  start: true,
  timeZone: 'Asia/Ho_Chi_Minh'
});

aqiJob.start();
weatherJob.start();
weatherUpdateJob.start();

app.use('/api/vnBoundaries', boundaryRouter);
app.use('/api/citiesName', citiesNameRouter);
app.use('/api/districtsName', districtsNameRouter);
app.use('/api/districts', uploadDistrictsInfoRouter);
app.use('/api/provinces', uploadProvincesInfoRouter);
app.use('/api/aqi', aqiRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/user', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Không tìm thấy route ${req.originalUrl}`));
});

app.use(errorController);

const server = app.listen(port, err => {
    if(err) throw err;
    console.log('Server is running at port ' + port)
});

process.on('unhandledRejection', err => {
  console.log(err)
  server.close(() => {
    process.exit(1);  
  });
});