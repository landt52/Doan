const Review = require('./../models/reviewModel');
const catchAsync = require('./../catchAsync');
const multer = require('multer');
const fs = require('fs');
const AppError = require('./../Error');
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
}).array('pics', 3);

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if(req.params.locationId) filter = {location: req.params.locationId}; 
    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        data: {
            reviews
        }
    })
});

exports.createReview = catchAsync(async (req, res, next) => {
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
        if (!req.body.location) req.body.location = req.params.locationId;
        if (!req.body.user) req.body.user = req.user.id;

        const {
          review,
          rating,
          location,
          user
        } = req.body;

        const upload = req.files.map(
          async file => await cloudinary.uploader.upload(file.path)
        );
        const images = await Promise.all(upload);
        const picsURL = images.map(pic => pic.secure_url);
        const picsID = images.map(pic => pic.public_id);

        data = {
          review,
          rating,
          images: picsURL,
          imageID: picsID,
          location,
          user 
        };

        await Review.create(data);

        const deletePromise = req.files.map(file => unlink(file.path));
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
})

exports.deleteReview = catchAsync(async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if(review.user._id != req.user.id) return next(new AppError('Bạn không có quyền thực hiện điều này', 404))

    const deletePromise = review.imageID.map(async id => await cloudinary.uploader.destroy(id));
    Promise.all(deletePromise);

    await Review.findByIdAndDelete(req.params.id);

    if (!review) return next(new AppError('Không tìm thấy review', 404));

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    return next(new AppError('Có lỗi xảy ra', 404))
  }
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Không tìm thấy thông tin của review', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (review.user._id != req.user.id)
    return next(new AppError('Bạn không có quyền thực hiện điều này', 404));

  const reviewToUpdate = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!review) return next(new AppError('Không tìm thấy review', 404));

  res.status(200).json({
    status: 'success',
    data: {
      review: reviewToUpdate
    }
  });
});