const User = require('./../models/userModel');
const catchAsync = require('./../catchAsync');
const AppError = require('./../Error');

const filter = (obj, ...fields) => {
    const newObj = {};

    Object.keys(obj).forEach(key => {
        if(fields.includes(key)) newObj[key] = obj[key]
    })

    return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

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
})

exports.deactivateUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        data: null
    })
})