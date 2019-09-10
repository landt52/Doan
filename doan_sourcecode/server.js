const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
var multer = require('multer');
const bodyParser = require("body-parser");
const path = require("path");
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

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'models');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).single('file');

app.post('/api/districts/:districtID', (req, res) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
})
app.use('/api/vnBoundaries', boundaryRouter);
app.use('/api/citiesName', citiesNameRouter);
app.use('/api/districtsName', districtsNameRouter);

app.listen(port, err => {
    if(err) throw err;
    console.log('Server is running at port ' + port)
});