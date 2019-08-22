let mongoose = require('mongoose');
let karmaSchema = new mongoose.Schema({
    memeKey: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true
    },
    uId: {
        type: String,
        required: true,
        trim: true
    },
    keywords: {
        type: [String],
        index: true
    },
    description: {
        type: String
    },
    memeFormat: {
        type: String,
        required: true
    },
    mediaLink: {
        type: String
    },
    mediaGridFsId: {
        type: String
    }
});