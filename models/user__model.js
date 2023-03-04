const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    name: String,
    phoneNumber: String,
    email: String,
    adress: String,
    national_id:String,
})

const UserModel = mongoose.model('Users', userModel);

module.exports = UserModel;