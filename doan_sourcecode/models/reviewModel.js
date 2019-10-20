const mongoose = require('mongoose');
const Location = require('./locationModel');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review không được để trống']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    images: {
      type: [String]
    },
    imageID: {
      type: [String]
    },
    location: {
      type: mongoose.Schema.ObjectId,
      ref: 'Location',
      required: [true, 'Review phải thuộc về 1 location']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review phải được viết bởi user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({location: 1, user: 1}, {unique: true})

reviewSchema.pre(/^find/, function(next){
  this.populate({
    path: 'user',
    select: 'userName photo'
  });

  next();
})

reviewSchema.statics.calculateRating = async function(location){
  const rating = await this.aggregate([
    {
      $match: {location}
    },
    {
      $group: {
        _id: '$location',
        rating: {$avg: '$rating'}
      }
    }
  ]);

  if(rating.length > 0){
    await Location.findByIdAndUpdate(location, {
      $set: {
        'location.rating': rating[0].rating
      }
    });
  }else{
    await Location.findByIdAndUpdate(location, {
      $set: {
        'location.rating': 0
      }
    });
  }
}

reviewSchema.post('save', function(){
  this.constructor.calculateRating(this.location);
})

reviewSchema.pre(/^findOneAnd/, async function(next){
  this.review = await this.findOne();

  next()
})

reviewSchema.post(/^findOneAnd/, async function() {
  await this.review.constructor.calculateRating(this.review.location);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;