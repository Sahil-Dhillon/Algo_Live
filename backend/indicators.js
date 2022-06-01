const SMA = require('technicalindicators').SMA;
const VWAP = require('technicalindicators').VWAP;
const zerodhaTrade = require("./broker/zerodha/trade");
const utils = require("./utils");
const { Supertrend } = require("stock-technical-indicators/study/Supertrend")
const newStudyATR = new Supertrend();
// function superTrend(data, period, multiplier,candleParam) {

// } 

async function sma({ instrument, timeFrame, period, candleParam }) {
    return new Promise(async (resolve, reject) => {
        try {
            let x = 5;
            let interval, data, candleIndex;
            // console.log(instrument, timeFrame, period, candleParam)

            if (timeFrame === "30" || timeFrame === "60") x = 10;
            if (timeFrame == "1") interval = "1min"
            else interval = timeFrame + "min"
            let end = new Date();

            if (candleParam === "open") {
                candleIndex = 1;
            } else if (candleParam === "high") {
                candleIndex = 2;
            } else if (candleParam === "low") {
                candleIndex = 3;
            } else if (candleParam === "close") {
                candleIndex = 4;
            }


            let start = new Date(end.getTime() - (x * 24 * 60 * 60 * 1000));
            console.log(start)
            console.log(end)
            try {
                data = await utils.getCandlesData(instrument, interval, start, end)
            }
            catch (err) {
                console.log(err)
                reject(err);
            }

            console.log("candle", data[0])
            let sma = SMA.calculate({
                period: period,
                values: data.map(x => x[candleParam])
            });
            // console.log(sma)
            resolve(sma[sma.length - 1]);
        } catch (err) {
            reject(err);
        }
    });
}

async function vwap({ instrument, timeFrame, period, candleParam }) {
    return new Promise(async (resolve, reject) => {
        try {
            let x = 5;
            let interval, data, candleIndex;

            if (timeFrame === "30" || timeFrame === "60") x = 10;
            if (timeFrame == "1") interval = "minute"
            else interval = timeFrame + "minute"
            let end = new Date();




            let start = new Date();
            try {
                data = await utils.getCandlesData(instrument, interval, start, end)
            }
            catch (err) {
                console.log(err)
                reject(err);
            }

            console.log("cancle", data[0])
            let sma = VWAP.calculate({
                period: period,
                high: data.map(x => x[2]),
                low: data.map(x => x[3]),
                close: data.map(x => x[4]),
                volume: data.map(x => x[5])
            });
            resolve(sma[sma.length - 1]);
        } catch (err) {
            reject(err);
        }

    })

}

async function superTrend({ instrument, timeFrame, period, multiplier, candleParam }) {
    return new Promise(async (resolve, reject) => {
        try {
            let x = 5;
            let interval, data, candleIndex;

            if (timeFrame === "30" || timeFrame === "60") x = 10;
            if (timeFrame == "1") interval = "minute"
            else interval = timeFrame + "minute"
            let end = new Date();

            let start = new Date(end.getTime() - (x * 24 * 60 * 60 * 1000));
            try {
                data = await utils.getCandlesData(instrument, interval, start, end)
            }
            catch (err) {
                console.log(err)
                reject(err);
            }

            let candleST = newStudyATR.calculate(candlesData, { period: period, multiplier: multiplier });

            if (candleST.length > 1) {

                let latestCandle = candleST[candleST.length - 1];
                //logger.info(latestCandle);

                let finalData = {
                    time: latestCandle[0],
                    instrument: instrument,
                    open: latestCandle[1],
                    high: latestCandle[2],
                    low: latestCandle[3],
                    close: latestCandle[4],
                    direction: latestCandle['Supertrend']['Direction'],
                    up: parseFloat((latestCandle['Supertrend']['Up']).toFixed(2)),
                    down: parseFloat((latestCandle['Supertrend']['Down']).toFixed(2)),
                    active: parseFloat((latestCandle['Supertrend']['ActiveTrend']).toFixed(2)),
                };

                logger.info({ "reponse": finalData });
                resolve(finalData["active"]);

            } else {
                reject("Couldn't find candles data to compute Supertrend ");
            }

        } catch (err) {
            reject(err);
        }
    });
}


module.exports["superTrend"] = superTrend;
module.exports["sma"] = sma;
module.exports["vwap"] = vwap;