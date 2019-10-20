const mongoose = require('mongoose');

const locationTypeSchema = mongoose.Schema({
    locationType: {
        type: String,
        required: [true],
        unique: true
    },
    icon: {
        type: String
    }
})

const LocationType = mongoose.model('LocationType', locationTypeSchema);

module.exports = LocationType