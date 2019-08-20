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

memeSchema.pre('find', function() {
    this._startTime = Date.now();
});

memeSchema.post('find', function(docs) {
    if (this._startTime != null) {
        let startTime = this._startTime;
        let completionTime = Date.now();
        docs.push({execTime: completionTime - startTime})
    }
});

memeSchema.index({"$**": "text"});
memeSchema.index({tags: 1});

let Meme = mongoose.model("Meme", memeSchema);
module.exports = Meme;