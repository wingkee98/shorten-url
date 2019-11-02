const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        unique: true,
        trim: true
    },
    shortUrl: {
        type: String
    },
    index: {
        type: Number
    }
});

module.exports = mongoose.model('url', urlSchema);