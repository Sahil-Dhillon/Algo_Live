var mongoose = require("mongoose");
const db = require("../config/db");
var paramsSchema = new mongoose.Schema({
    userID: String,
    password: String,
    pin: String,
    apikey: String,
    secret: String,
    access_token: String,
    enctoken: String,
    auth_type: String,
    totp_secret: String
})
module.exports = mongoose.model("params", paramsSchema);