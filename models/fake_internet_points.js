let mongoose = require('mongoose');
let karmaSchema = new mongoose.Schema({
    memeKey: {
        type: String,
        required: true,
        trim: true
    },
    uId: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    }
});

let Karma = mongoose.model("Karma", karmaSchema);
module.exports = Karma;