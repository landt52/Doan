const mongoose = require('mongoose');
const LocationType = require('./typeModel');

const locationSchema = new mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      name: {
        type: String,
        required: true
      },
      cover: {
        type: String,
        required: true
      },
      coverId: {
        type: String
      },
      locationType: {
        type: Object,
        required: true
      },
      address: {
        type: String
      },
      summary: {
        type: String,
        required: true
      },
      phone: {
        type: String
      },
      website: {
        type: String
      },
      hours: {
        type: Object
      },
      writer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      images: {
        type: [String],
        required: true
      },
      imageID: {
        type: [String]
      },
      rating: {
        type: Number,
        default: 0,
        set: rating => Math.round(rating * 10) / 10 
      }
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

locationSchema.index({location: '2dsphere'});

locationSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'location',
  localField: '_id'
})

locationSchema.pre('save', async function(next){
  const locationType = await LocationType.findOne({locationType: this.location.locationType});
  if(!locationType){
    const defaultLocation = await LocationType.findOne({locationType: 'Default'});
    this.location.locationType = defaultLocation;
  }else{
    this.location.locationType = locationType;
  }

  next();
})

locationSchema.pre(/^findOneAnd/, async function(next) {
  if (this.getUpdate().$set['location.locationType']) {
    const locationType = await LocationType.findOne({
      locationType: this.getUpdate().$set['location.locationType']
    });

    if (!locationType) {
      const defaultLocation = await LocationType.findOne({
        locationType: 'Default'
      });
      this.getUpdate().$set['location.locationType'] = defaultLocation;
    } else {
      this.getUpdate().$set['location.locationType'] = locationType;
    }
  }else return next()

  next();
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;