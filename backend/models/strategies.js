const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const strategySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    account: {
        type: ObjectId,
        ref: "Account",
    },
    entryTime: {
        type: Date,
        required: true,
    },
    exitTime: {
        type: Date,
        required: true,
    },
    direction: {
        type: String,
        required: true,
        enum: ["BUY", "SELL","BOTH"],
    },
    timeFrame: {
        type: String,
        required: true,
    },
    orderType: {
        type: String,
        required: true,
        enum: ["MIS", "NRML","CNC"],
    },
    quantity: {
        type: Number,
        required: true,
    },
    stopLoss: {
        type: Number,
        required: true,
    },
    target: {
        type: Number,
        required: true,
    },

    instrument1: {
        type: String,
        required: true,
    },
    instrument2: {
        type: String,
        required: true,
    },
    indicator1: {
        type: String,
        required: true,
    },
    period1: {
        type: Number,

    },
    multiplier1: {
        type: Number,
    },
    candleParam1: {
        type: String,
    },
    indicator2: {
        type: String,
        required: true,
    },
    period2: {
        type: Number,
        
    },
    multiplier2: {
        type: Number,
    },
    candleParam2: {
        type: String,
    },
    condition: {
        type: String,
        enum: ["crossabove", "crossdown", "crossover","greaterthan","lessthan","equalto"],
    },
    user: {
        type: ObjectId,
        ref: "User",
    },
    active: {
        type: Boolean,
        default: true,
    },
    targetunit: {
        type: String,
        enum: ["%", "Rs"],
    },
    stopLossunit: {
        type: String,
        enum: ["%", "Rs"],
    },
});

module.exports = mongoose.model("Strategy", strategySchema);
