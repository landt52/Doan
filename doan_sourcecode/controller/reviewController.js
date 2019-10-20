const Review = require('./../models/reviewModel');
const catchAsync = require('./../catchAsync');

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
    if(!req.body.location) req.body.location = req.params.locationId;
    if(!req.body.user) req.body.user = req.user.id;
    
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    })
})

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) return next(new AppError('Không tìm thấy review', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
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
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!review) return next(new AppError('Không tìm thấy review', 404));

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});