const kiteConnect = require("kiteconnect").KiteConnect;
const logger = require("pino")();
const Utils = require("../../utils");
let daily = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
let weekly = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "O", "N", "D"];
let monthly = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];


function parseDate(dateObj) {
    let parsedDate = dateObj.getFullYear() + "-" + daily[dateObj.getMonth() + 1] + "-" + daily[dateObj.getDate()];
    console.log(parsedDate);
    return parsedDate;
}
function placeTrade(userID,
    apiKey,
    accessToken,
    instrument,
    t_type,
    order_type,
    product,
    trigger_price,
    qty,
    price) {

    console.log(userID, apiKey, accessToken, instrument, t_type, qty, order_type, product, price, trigger_price);
    return new Promise(async (resolve, reject) => {

        try {
            let exchange = instrument.split(":")[0];
            let symbol = instrument.split(":")[1];

            let kc = new kiteConnect({
                api_key: apiKey
            });

            kc.setAccessToken(accessToken);

            let order = {
                "exchange": exchange,
                "tradingsymbol": symbol,
                "transaction_type": t_type,
                "quantity": qty,
                "order_type": order_type,
                "product": product,
                "price": price,
                "trigger_price": trigger_price
            }

            kc.placeOrder("regular", order)
                .then(function (response) {

                    if (response['order_id'] == undefined || response['order_id'] == null) {
                        logger.error({ response, "userID": userID });
                        reject(response);
                    } else {
                        logger.info(["SUCCESS  ", userID, response['order_id']]);
                        resolve(response);
                    }

                }).catch(function (err) {
                    logger.error({ err, "userID": userID });
                    reject(err.message);
                });

        } catch (err) {
            logger.error({ "ERROR": err, "userID": userID });
            reject(err);
        }

    });

}


function getClientPositions({ apiKey, accessToken }) {


    return new Promise(async (resolve, reject) => {
        let kc = new kiteConnect({
            api_key: apiKey
        });
        kc.setAccessToken(accessToken);

        try {
            let positions = await kc.getPositions();
            //logger.info({ "positions" : positions});

            for (let i = 0; i < positions['net'].length; i++) {
                posObj = positions['net'][i];
                try {
                    thisLTP = await Utils.getLTP(posObj["exchange"] + ":" + posObj["tradingsymbol"]);
                    //logger.info(i,posObj["tradingsymbol"],posObj["buy_quantity"]-posObj["sell_quantity"], " => ",thisLTP);
                    positions['net'][i]['last_price'] = thisLTP;
                } catch (err) {
                    // LTP API didn't found the price for this symbol
                    // keep the last_price as it is 
                    logger.error(err);
                }
            }

            let customPositions = [];
            positions['net'].forEach(position => {
                let pnl = 0;
                if (position.buy_quantity == position.sell_quantity) {
                    pnl += position.pnl;
                } else {
                    pnl += (position.last_price - position.average_price) * (position.buy_quantity - position.sell_quantity);
                }

                let customPositionObj = {
                    "symbol": position['tradingsymbol'],
                    "productType": position['product'],
                    "qty": position['quantity'],
                    "pnl": pnl
                }
                customPositions.push(customPositionObj);
            });

            //logger.info(customPositions);
            resolve(customPositions);
        } catch (err) {
            logger.error(err);
            reject(err);
        }
    })
}

function getCandlesData({ apiKey, accessToken, instrument, interval, start, end }) {
    return new Promise(async (resolve, reject) => {
        console.log(apiKey, accessToken, instrument, interval, start, end);
        let kc = new kiteConnect({
            api_key: apiKey
        });
        kc.setAccessToken(accessToken);

        let instrumentID = await Utils.getInstrumentID(instrument);
        console.log(instrumentID);
        try {
            let candles = await kc.getHistoricalData(instrumentID, interval, parseDate(start), parseDate(end));
            resolve(candles);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

function getTodaysCandle({ apiKey, accessToken, instrument, interval }) {
    return new Promise(async (resolve, reject) => {
        console.log(apiKey, accessToken, instrument, interval);
        let kc = new kiteConnect({
            api_key: apiKey
        });
        let intV
        if (interval == "1") intV = "minute"
        else intV = interval + "minute"
        // console.log(intV);
        kc.setAccessToken(accessToken);
        let currDate = new Date();
        let instrumentID = await Utils.getInstrumentID(instrument);
        try {
            let candles = await kc.getHistoricalData(instrumentID, intV, parseDate(currDate), parseDate(currDate));
            resolve(candles);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

module.exports['placeTrade'] = placeTrade;
module.exports['getClientPositions'] = getClientPositions;
module.exports['getCandlesData'] = getCandlesData;
module.exports['getTodaysCandle'] = getTodaysCandle;