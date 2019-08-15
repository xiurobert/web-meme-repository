var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    key: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    keywords: {
        type: Array
    },
    mediaLink: {
        type: String,
        required: true
    }
});

module.exports = UserSchema;