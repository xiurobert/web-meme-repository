let mongoose = require('mongoose');
let memeSchema = new mongoose.Schema({
    key: {
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

memeSchema.index({"$**": "text"});
memeSchema.index({tags: 1});

let Meme = mongoose.model("Meme", memeSchema);
module.exports = Meme;