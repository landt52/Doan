const AppError = require('./../Error');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack
  });
}

const sendErrorProv = (err, res) => {
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }else{
    res.status(500).json({
      status: 'fail',
      message: 'Có lỗi xảy ra'
    })
  }
}

const handleCastError = err => {
  const message = `Không tìm thấy ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

const handleDuplicateFields = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Trùng trường dữ liệu ${value}`;
  return new AppError('ABC', 400);
}

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(error => error.message);
  const message = `Dữ liệu không hợp lệ. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

const handleUnauthorizedError = err => {
  const message = err;
  return new AppError(message, 401);
};

const handleJwtError = () => {
  return new AppError('Token không hợp lệ', 401);
};

const handleJwtExpiredError = () => {
  return new AppError('Token đã hết hạn. Hãy login lại', 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err, res)
  }else if(process.env.NODE_ENV === 'production'){
    let error = Object.assign({}, err)
    if(error.name === 'CastError') error = handleCastError(error);
    if(error.code === 11000) error = handleDuplicateFields(error);
    if(error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'UnauthorizedError') error = handleUnauthorizedError(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();
    sendErrorProv(err, res);
  }
};