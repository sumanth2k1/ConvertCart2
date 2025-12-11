const mongoose = require('mongoose');

module.exports.ConnectDB = (url) => {
    return mongoose.connect(url);
};