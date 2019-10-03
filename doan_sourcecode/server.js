const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const path = require("path");
const AppError = require('./Error');
const errorController = require('./controller/errorController');
const cron = require('cron');
const aqiController = require('./controller/aqiController'); 
require('dotenv').config();

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

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());
if(process.env.NODE_ENV.trim() === 'development') app.use(morgan('dev'));

const job = new cron.CronJob({
  cronTime: '0 * * * *',
  onTick: aqiController.updateAqi(),
  start: true,
  timeZone: 'Asia/Ho_Chi_Minh'
})

job.start()

app.use('/api/vnBoundaries', boundaryRouter);
app.use('/api/citiesName', citiesNameRouter);
app.use('/api/districtsName', districtsNameRouter);
app.use('/api/districts', uploadDistrictsInfoRouter);
app.use('/api/provinces', uploadProvincesInfoRouter);
app.use('/api/aqi', aqiRouter);

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