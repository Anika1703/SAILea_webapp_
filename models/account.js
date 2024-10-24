var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: String,  // Add this field
    name: String,      // Add this field
    password: String
});

Account.plugin(passportLocalMongoose, {
    // This allows users to login with email
    usernameField: 'email'
});

module.exports = mongoose.model('Account', Account);