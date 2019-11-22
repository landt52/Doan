const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Role = require('./Role');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'User cần có username'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'User cần có email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Làm ơn điền đúng thông tin email']
  },
  photo: {
    type: String,
    default:
      'https://res.cloudinary.com/private-name/image/upload/v1570973256/default-user-icon-4.jpg'
  },
  photoId: String,
  password: {
    type: String,
    required: [true, 'Làm ơn điền password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Làm ơn điền lại password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password không giống nhau'
    }
  },
  passwordChangedAt: {
    type: Date
  },
  role: {
    type: String,
    enum: Object.keys(Role),
    default: Role.User
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpired: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual('locations', {
  ref: 'Location',
  foreignField: 'location.writer',
  localField: '_id'
});

userSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'user',
  localField: '_id'
});

userSchema.virtual('tickets', {
  ref: 'Ticket',
  foreignField: 'user',
  localField: '_id'
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre(/^find/, function(next){
    this.find({active: {$ne: false}});
    next();
})

userSchema.methods.checkPassword = async function(password, userPassword){
    return await bcrypt.compare(password, userPassword);
}

userSchema.methods.changedPassword = function(JWTiat){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(
          this.passwordChangedAt.getTime() / 1000
        );

        return JWTiat < changedTimestamp;
    }
    
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpired = Date.now() + 600000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;