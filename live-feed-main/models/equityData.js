const mongoose = require('mongoose');
const request = require('request');


const equitiesData = mongoose.model('equitiesData', new mongoose.Schema({
    // future: String,
    instrument_token: Number,
    minute: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    //     }
    // ]

}, {
    timestamps: true
})
    .index({ instrument_token: 1, minute: 1 }, { unique: true })
)

module.exports = equitiesData
// const futures = mongoose.model('fnoStockNames')

// futures.find().then(data=>{
//     const d = data.map(v=>{return {equity:v.fnoStockName,instrument_token:v.instrument_token}})
//     console.log(d)
//     equitiesData.insertMany(d).then(data=>{
//         console.log(data)
//     })
// })