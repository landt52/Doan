const Location = require('./../models/locationModel');
const Review = require('./../models/reviewModel');
const LocationType = require('./../models/typeModel');
const multer = require('multer');
const fs = require('fs');
const AppError = require('./../Error');
const catchAsync = require('./../catchAsync');
const cloudinary = require('cloudinary').v2;
const util = require('util');
const unlink = util.promisify(fs.unlink);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'models');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadPics = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    if (
      ['png', 'jpeg', 'jpg'].indexOf(
        file.originalname.split('.')[file.originalname.split('.').length - 1]
      ) === -1
    ) {
      return next(new AppError('Sai đuôi file', 404));
    }
    callback(null, true);
  }
}).array('pics', 4);

exports.getAllLocations = catchAsync(async (req, res, next) => {
  const locationsData = await Location.find({}, {
    "location.type": 1,
    "location.rating": 1,
    "location.coordinates": 1,
    "location.name": 1,
    "location.locationType": 1,
    "location.cover": 1,
    "location.address": 1,
    "location.phone": 1,
    "location.website": 1
  }).populate("reviews");

  const locations = locationsData.map(row => ({
    type: row.location.type,
    coordinates: row.location.coordinates,
    id: row._id,
    properties: {
      rating: row.location.rating,
      name: row.location.name,
      cover: row.location.cover,
      locationType: row.location.locationType,
      address: row.location.address,
      phone: row.location.phone,
      website: row.location.website,
      reviewsCount: row.reviews.length
    }
  }))

  if(!locations) return next(new AppError('Không tìm thấy địa điểm', 404))

  res.status(200).json({
    status: 'success',
    data: {
      locations
    }
  });
});

exports.getLocationsByType = catchAsync(async (req, res, next) => {
  const type = req.params.locationType;
  const locationsData = await Location.find(
    { 'location.locationType.locationType': type },
    {
      'location.type': 1,
      'location.rating': 1,
      'location.coordinates': 1,
      'location.name': 1,
      'location.locationType': 1,
      'location.cover': 1,
      'location.address': 1,
      'location.phone': 1,
      'location.website': 1
    }
  ).populate("reviews")

  const locations = locationsData.map(row => ({
    type: row.location.type,
    coordinates: row.location.coordinates,
    id: row._id,
    properties: {
      rating: row.location.rating,
      name: row.location.name,
      cover: row.location.cover,
      locationType: row.location.locationType,
      address: row.location.address,
      phone: row.location.phone,
      website: row.location.website,
      reviewsCount: row.reviews.length
    }
  }));

  if(!locationsData) return next(new AppError('Không tìm thấy loại địa điểm', 404));

  res.status(200).json({
    status: 'success',
    locations
  })
})

exports.getLocationTypes = catchAsync(async (req, res, next) => {
  const typesInfo = await LocationType.find({}, {locationType: 1});
  const locationTypes = typesInfo.map(type => type.locationType)
  res.status(200).json({
    status: 'success',
    locationTypes
  })
});

exports.createLocation = catchAsync(async (req, res, next) => {
  await uploadPics(req, res, async err => {
    if (!req.files) {
      return next(new AppError('Không có file', 500));
    }
    if (err instanceof multer.MulterError) {
      return next(new AppError('Có lỗi xảy ra khi đọc file', 500));
    } else if (err) {
      return next(new AppError('Có lỗi xảy ra', 500));
    }
    if (req.files) {
      try {
        let data;
        const {lat, lng, name, locationType, address, summary, phone, website, hours} = req.body;
        const writer = req.user._id;

        const upload = req.files.map(async file => await cloudinary.uploader.upload(file.path))
        const images = await Promise.all(upload);
        const [cover, ...pics] = images;
        const picsURL = pics.map(pic => pic.secure_url);
        const picsID = pics.map(pic => pic.public_id);

        data = {
          location: {
            type: 'Point',
            coordinates: [+lng, +lat],
            name,
            cover: cover.secure_url,
            coverId: cover.public_id,
            locationType,
            address,
            summary,
            phone,
            website,
            hours: JSON.parse(hours),
            writer,
            images: picsURL,
            imageID: picsID
          }
        }

        await Location.create(data)

        const deletePromise = req.files.map(
          file => unlink(file.path)
        );
        Promise.all(deletePromise);
        res.status(201).json({
          status: 'success'
        });
      } catch (error) {
        const deletePromise = req.files.map(file => unlink(file.path));
        Promise.all(deletePromise);
        return next(new AppError('Có lỗi xảy ra khi đọc file', 500));
      }
    }
  });
});

exports.getLocationInfo = catchAsync(async (req, res, next) => {
  const location = await Location.findById(req.params.locationId).populate('reviews');

  if(!location){
    return next(new AppError('Không tìm thấy thông tin của địa điểm', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      location,
      reviewsCount: location.reviews.length
    }
  })
});

exports.updateLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findByIdAndUpdate(req.params.locationId, req.body, {
    new: true,
    runValidators: true
  })

  if(!location) return next(new AppError('Không tìm thấy địa điểm', 404));

  res.status(200).json({
    status: 'success',
    data: {
      location
    }
  })
})

exports.deleteLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findById(req.params.locationId).populate('reviews');
  const reviewsID = location.reviews.map(review => review.id);
  const deletePromise = location.location.imageID.map(
    async id => await cloudinary.uploader.destroy(id)
  );
  const deleteReviewImage = location.reviews
    .map(review => review.imageID)
    .reduce((a, b) => a.concat(b), []).map(async id => await cloudinary.uploader.destroy(id))
  const deleteReview = reviewsID.map(async reviewID => await Review.findByIdAndDelete(reviewID));
  await cloudinary.uploader.destroy(location.location.coverId);
  await Promise.all(deletePromise);
  await Promise.all(deleteReviewImage);
  await Promise.all(deleteReview);
  await Location.findByIdAndDelete(req.params.locationId);

  if(!location) return next(new AppError('Không tìm thấy địa điểm', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getLocationWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = distance / 6378.1;

  if (!lat || !lng) return next(new AppError('Không tìm thấy địa điểm', 400));

  const locations = await Location.find({
    location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
  })

  res.status(200).json({
    status: 'success',
    data: {
      locations
    }
  });
});