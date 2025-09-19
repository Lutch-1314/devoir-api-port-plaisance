const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CatwaySchema = new Schema ({
    catwayNumber: {
        type : Number,
        required : true,
        unique : true
    },
    catwayType: {
        type : String,
        enum : ['short', 'long'],
        required : true
    },
    catwayState: {
        type : String,
        required : true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Catway', CatwaySchema);