const Location = require('./../models/locationModel');
const Review = require('./../models/reviewModel');
const LocationType = require('./../models/typeModel');
const Ticket = require('./../models/ticketModel');
const multer = require('multer');
const fs = require('fs');
const AppError = require('./../Error');
const catchAsync = require('./../catchAsync');
const cloudinary = require('cloudinary').v2;
const util = require('util');
const unlink = util.promisify(fs.unlink);
const Role = require('./../models/Role');

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
  const locationsData = await Location.find(
    { 'location.isPending': { $ne: true } },
    {
      'location.rating': 1,
      'location.name': 1,
      'location.cover': 1,
      'location.writer': 1
    }
  );

  if(!locationsData) return next(new AppError('Không tìm thấy địa điểm', 404))

  res.status(200).json({
    status: 'success',
    data: {
      locationsData
    }
  });
});

exports.getPendingLocation = catchAsync(async (req, res, next) => {
  const pendingLocations = await Location.find(
      { 'location.isPending': true },
      {
        'location.rating': 1,
        'location.name': 1,
        'location.cover': 1,
        'location.writer': 1
      }
    ).populate({
      path: 'location.writer',
      select: 'userName'
    });

    if(!pendingLocations) return next(new AppError('Không tìm thấy địa điểm', 404))

    res.status(200).json({
      status: 'success',
      pendingLocations
    });
});

exports.getLocationsByType = catchAsync(async (req, res, next) => {
  const type = req.params.locationType;
  const locationsData = await Location.find(
    {
      'location.locationType.locationType': type,
      'location.isPending': { $ne: true }
    },
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
  ).populate('reviews');

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
        if(req.user.role === Role.Admin){
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
              imageID: picsID,
              isPending: false
            }
          };
        }else{
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
          };
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
  const {
    lat,
    lng,
    name,
    locationType,
    address,
    summary,
    phone,
    website,
    hours
  } = req.body;

  const checkAuth = await Location.findOne({ _id: req.params.locationId }, {"location.writer": 1});
  if(req.user.role !== Role.Admin){
    if (checkAuth.location.writer.toString() !== req.user._id.toString())
      return next(new AppError('Bạn không có quyền thực hiện điều này', 404));
  }

  let location;

  if(req.user.role === Role.Admin){
    location = await Location.findOneAndUpdate(
      { _id: req.params.locationId },
      {
        $set: {
          'location.coordinates': [+lng, +lat],
          'location.name': name,
          'location.locationType': locationType,
          'location.address': address,
          'location.summary': summary,
          'location.phone': phone,
          'location.website': website,
          'location.hours': JSON.parse(hours)
        }
      },
      {
        new: true,
        runValidators: true,
        upsert: true
      }
    );
  }else{
    location = await Location.findOneAndUpdate(
      { _id: req.params.locationId },
      {
        $set: {
          'location.coordinates': [+lng, +lat],
          'location.name': name,
          'location.locationType': locationType,
          'location.address': address,
          'location.summary': summary,
          'location.phone': phone,
          'location.website': website,
          'location.hours': JSON.parse(hours),
          'location.isPending': true
        }
      },
      {
        new: true,
        runValidators: true,
        upsert: true
      }
    );
  }

  if(!location) return next(new AppError('Không tìm thấy địa điểm', 404));

  res.status(200).json({
    status: 'success',
    data: {
      location
    }
  })
})

exports.deleteLocation = catchAsync(async (req, res, next) => {
  const checkAuth = await Location.findOne(
    { _id: req.params.locationId },
    { 'location.writer': 1 }
  );
  if (req.user.role !== Role.Admin) {
    if (checkAuth.location.writer.toString() !== req.user._id.toString())
      return next(new AppError('Bạn không có quyền thực hiện điều này', 404));
  }

  const location = await Location.findById(req.params.locationId).populate('reviews');

  if (!location) return next(new AppError('Không tìm thấy địa điểm', 404));
  
  const reviewsID = location.reviews.map(review => review.id);
  if(location.location.imageID.length !== 0){
    const deletePromise = location.location.imageID.map(
      async id => await cloudinary.uploader.destroy(id)
    );
    await Promise.all(deletePromise);
  }

  if(reviewsID.length !== 0){
    const deleteReview = reviewsID.map(
      async reviewID => await Review.findByIdAndDelete(reviewID)
    );
    await Promise.all(deleteReview);

    const deleteReviewImage = location.reviews
      .map(review => review.imageID)
    
    if(deleteReviewImage.length !== 0){
      const deleteReviewImagePromises = deleteReviewImage
        .reduce((cur, acc) => cur.concat(acc), [])
        .map(async id => await cloudinary.uploader.destroy(id));

      await Promise.all(deleteReviewImagePromises);
    }
  }  
  
  await cloudinary.uploader.destroy(location.location.coverId);
  await Location.findByIdAndDelete(req.params.locationId);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.approveLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findByIdAndUpdate(req.params.locationId, {
    $set: {
      "location.isPending": false
    }
  })

  const ticketData = {
    user: req.body.writer,
    locationName: req.body.name,
    ticketType: 'Approve'
  }

  await Ticket.create(ticketData);

  res.status(200).json({
    status: 'success'
  })
});

exports.rejectLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findById(req.params.locationId).populate(
    'reviews'
  );
  if (!location) return next(new AppError('Không tìm thấy địa điểm', 404));

  const reviewsID = location.reviews.map(review => review.id);
  if (location.location.imageID.length !== 0) {
    const deletePromise = location.location.imageID.map(
      async id => await cloudinary.uploader.destroy(id)
    );
    await Promise.all(deletePromise);
  }

  if (reviewsID.length !== 0) {
    const deleteReview = reviewsID.map(
      async reviewID => await Review.findByIdAndDelete(reviewID)
    );
    await Promise.all(deleteReview);

    const deleteReviewImage = location.reviews.map(review => review.imageID);

    if (deleteReviewImage.length !== 0) {
      const deleteReviewImagePromises = deleteReviewImage
        .reduce((cur, acc) => cur.concat(acc), [])
        .map(async id => await cloudinary.uploader.destroy(id));

      await Promise.all(deleteReviewImagePromises);
    }
  }

  await cloudinary.uploader.destroy(location.location.coverId);
  await Location.findByIdAndDelete(req.params.locationId);

  if(req.body.writer.toString() !== req.user._id.toString()){
    const ticketData = {
      user: req.body.writer,
      locationName: req.body.name,
      ticketType: 'Reject',
      reason: req.body.reason
    };

    await Ticket.create(ticketData);
  }

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