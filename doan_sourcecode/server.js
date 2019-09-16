const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const path = require("path");
const AppError = require('./Error');
const errorController = require('./controller/errorController');
require('dotenv').config();


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

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());
if(process.env.NODE_ENV.trim() === 'development') app.use(morgan('dev'));

app.use('/api/vnBoundaries', boundaryRouter);
app.use('/api/citiesName', citiesNameRouter);
app.use('/api/districtsName', districtsNameRouter);
app.use('/api/districts', uploadDistrictsInfoRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Không tìm thấy route ${req.originalUrl}`));
});

app.use(errorController);

app.listen(port, err => {
    if(err) throw err;
    console.log('Server is running at port ' + port)
});