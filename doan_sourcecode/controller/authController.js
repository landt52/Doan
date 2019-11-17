const {promisify} = require('util');
const crypto = require('crypto');
const User = require('./../models/userModel');
const catchAsync = require('./../catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../Error');
const Email = require('./../email');

const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

exports.authorize = catchAsync(async (req, res, next) => {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }else if(req.cookies.jwt){
    token = req.cookies.jwt
  }

  if(!token){
    return next(new AppError('Bạn chưa đăng nhập', 401))
  }

  const decodedJwt = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decodedJwt.id);

  if(!currentUser){
    return next(new AppError('Tài khoản không tồn tại', 401))
  }

  if(currentUser.changedPassword(decodedJwt.iat)){
    return next(new AppError('Hãy đăng nhập lại'), 401)
  }

  req.user = currentUser;

  next();
})

exports.signup = catchAsync(async (req, res, next) => {
  if(req.body.role){
    return next(new AppError('Bạn không được quyền tạo role', 400));
  }

  const newUser = await User.create(req.body);

  const url = 0;
  await new Email(newUser, url).sendWelcome();

  const token = createToken(newUser._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRED_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if(process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions);

  newUser.password = undefined;

  res.status(201).json({ 
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;

  if(!email || !password){
    return next(new AppError('Hãy điền đủ email và password', 400));
  }

  const user = await User.findOne({email}, {role: 1, userName: 1, photo: 1}).select('+password');

  if(!user || !(await user.checkPassword(password, user.password))){
    return next(new AppError('Sai email hoặc password', 401));
  }

  const token = createToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRED_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
})

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      return next(new AppError('Bạn không có quyền thực hiện điều này', 403))
    }

    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});

  if(!user){
    return next(new AppError('Không tìm thấy email', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave: false});

  try {
    const message = `${resetToken}`;
    await new Email(user, message).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token đã được gửi đến email'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Có lỗi xảy ra khi gửi email', 500));
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken, 
    passwordResetExpired: {$gt: Date.now()}
  });

  if(!user){
    return next(new AppError('Token sai hoặc hết hạn', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;

  await user.save();

  const token = createToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRED_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: [
      user
    ]
  });
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const checkPassword = await user.checkPassword(req.body.passwordCurrent, user.password);
  
  if(!checkPassword){
    return next(new AppError('Password sai', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  const token = createToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRED_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
});

exports.checkCookies = async (req, res, next) => {
    if (req.cookies.jwt) return next();
    else {
      localStorage.clear();
      return next(new AppError('Bạn đã xóa cookie, làm ơn đăng nhập lại', 500));
    }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'Userhasloggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    status: 'success'
  })
}

exports.getRole = (req, res) => {
  if(req.user.role){
    res.status(200).json({
      status: 'success',
      role: req.user.role,
      id: req.user._id
    });
  } else return next(new AppError('Token sai', 404));
}