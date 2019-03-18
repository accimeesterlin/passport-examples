const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    profileId: String,
    email: String,
    username: String,
    profileImage: String,
    accessToken: String,
    refreshToken: String,
    provider: String,
});

const User = mongoose.model('User', UserSchema);
module.exports = User