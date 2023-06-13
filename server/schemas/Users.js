const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    authLevel: Number
})

const Users = mongoose.model("Users", userSchema, 'users');

module.exports = Users;