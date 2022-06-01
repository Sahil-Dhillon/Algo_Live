const mongoose = require('mongoose');


const fnoStockName = mongoose.model('fnoStockNames', new mongoose.Schema({
    fnoStockName: String,
    instrument_token: Number
}))

module.exports = fnoStockName