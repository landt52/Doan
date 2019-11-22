const mongoose = require('mongoose');

const attributeTypeSchema = new mongoose.Schema({
    icon: {
        type: Object
    },
    iconList: {
        type: [String]
    }
})

const AttributeIcon = mongoose.model('AttributeIcon', attributeTypeSchema);

module.exports = AttributeIcon;