const mongoose = require('mongoose');

const urlIndexSchema = mongoose.Schema({
    index: Number
});

module.exports = mongoose.model('urlIndex', urlIndexSchema);