const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, '1 quan-huyen can co id'],
        unique: true
    },
    provincename: {
        type: String,
        required: [true, '1 quan - huyen can thuoc ve 1 thanh pho - tinh']
    },
    districtname: {
        type: String,
        required: [true, '1 quan - huyen can co ten']
    },
    data: {
        type: Object
    }
})

const District = mongoose.model('District', districtSchema);

module.exports = District;