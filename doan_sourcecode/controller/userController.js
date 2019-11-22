const User = require('./../models/userModel');
const catchAsync = require('./../catchAsync');
const AppError = require('./../Error');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const Ticket = require('./../models/ticketModel');

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

const uploadAvatar = multer({
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
}).single('avatar');

const filter = (obj, ...fields) => {
    const newObj = {};

    Object.keys(obj).forEach(key => {
        if(fields.includes(key)) newObj[key] = obj[key]
    })

    return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().select('-passwordChangedAt -role');

    if (!users) return next(new AppError('Không tìm thấy thông tin', 404));

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
});

exports.updateInfo = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('Không được update password ở đây', 400))
    }

    const filterData = filter(req.body, 'userName', 'email');

    const user = await User.findByIdAndUpdate(req.user.id, filterData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
});

exports.getInfo = catchAsync(async (req, res, next) => {
    let user = await User.findOne(req.user._id);

    if(!user) return next(new AppError('Không tìm thấy thông tin user', 404));

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.deactivateUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.params.id, {active: false})

    res.status(204).json({
        status: 'success',
        data: null
    })
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new AppError('Không tìm thấy thông tin của user', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!user) return next(new AppError('Không tìm thấy user', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return next(new AppError('Không tìm thấy user', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.changeAvatar = catchAsync(async (req, res, next) => {
  await uploadAvatar(req, res, async err => {
    if (!req.file) {
      return next(new AppError('Không có file', 500));
    }
    if (err instanceof multer.MulterError) {
      return next(new AppError('Có lỗi xảy ra khi đọc file', 500));
    } else if (err) {
      return next(new AppError('Có lỗi xảy ra', 500));
    }
    if (req.file) {
      try {
        const user = await User.findById(req.user._id);
        if(user.photoId){
          await cloudinary.uploader.destroy(user.photoId)
          const newAvatar = await cloudinary.uploader.upload(req.file.path);

          await User.findByIdAndUpdate(req.user.id, {
            photo: newAvatar.secure_url,
            photoId: newAvatar.public_id
          }, {
            new: true,
            runValidators: true
          });
        }else{
          const newAvatar = await cloudinary.uploader.upload(req.file.path);

          await User.findByIdAndUpdate(
            req.user.id,
            {
              photo: newAvatar.secure_url,
              photoId: newAvatar.public_id
            },
            {
              new: true,
              runValidators: true
            }
          );
        }

        fs.unlink(req.file.path, () => {
          res.status(201).json({
            status: 'success'
          });
        });
        
      } catch (error) {
        fs.unlink(req.file.path, () => {
          return next(new AppError('Có lỗi xảy ra khi đọc file', 500));
        });
      }
    }
  });
})

exports.getMyLocations = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("locations",
    "location.rating location.name location.cover");

  if(!user) return next(new AppError('Không tìm thấy user', 404))

  res.status(200).json({
    status: 'success',
    locations: user.locations
  })
})

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('reviews');
  if(!user) return next(new AppError('Không tìm thấy user', 404));
  
  res.status(200).json({
    status: 'success',
    reviews: user.reviews
  })
});

exports.getTicket = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('tickets');
  if(!user) return next(new AppError('Không tìm thấy user', 404));

  res.status(200).json({
    status: 'success',
    tickets: user.tickets
  })
})

exports.acceptTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.ticketId)

  if(!ticket) return next(new AppError('Không tìm thấy ticket', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
})