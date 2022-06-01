
const instrumentID = require("../data/instrumentID.js");
const fetch = require("node-fetch");
const params = require("../models/params.js");
const logger = require("pino")();
const zerodhaTrade = require("../broker/zerodha/trade");
const zerodhaLogin = require("../broker/zerodha/login");
const LIVEPRICES_URL = "http://localhost:4007"
let daily = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]

function parseDate(dateObj) {
    let parsedDate = dateObj.getFullYear() + "-" + daily[dateObj.getMonth() + 1] + "-" + daily[dateObj.getDate()];
    return parsedDate;
}


function print(msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9, msg10, msg11) {
    var dt = new Date();
    var currTime = dt.toLocaleString("en-US");
    if (msg1 === undefined) {
        console.log(currTime);
    } else if (msg2 === undefined) {
        console.log(currTime, " ::  ", msg1);
    } else if (msg3 === undefined) {
        console.log(currTime, " ::  ", msg1, msg2);
    } else if (msg4 === undefined) {
        console.log(currTime, " ::  ", msg1, msg2, msg3);
    } else if (msg5 === undefined) {
        console.log(currTime, " ::  ", msg1, msg2, msg3, msg4);
    } else if (msg6 === undefined) {
        console.log(currTime, " ::  ", msg1, msg2, msg3, msg4, msg5);
    } else if (msg7 === undefined) {
        console.log(currTime, " ::  ", msg1, msg2, msg3, msg4, msg5, msg6);
    } else if (msg8 === undefined) {
        console.log(currTime, " ::  ", msg1, msg2, msg3, msg4, msg5, msg6, msg7);
    } else if (msg9 === undefined) {
        console.log(currTime, " ::  ", msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8);
    } else if (msg10 === undefined) {
        console.log(currTime, " ::  ", msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9);
    } else if (msg11 === undefined) {
        console.log(currTime, " ::  ", msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9, msg10);
    } else {
        console.log(currTime, " ::  ", msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9, msg10, msg11);
    }
};

async function waitForXseconds(x) {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("done");
        }, x * 1000);
    })
};

function fetchCandlesData(instrument, timeframe, fromDate, toDate) {
    console.log(instrument, fromDate, toDate, timeframe)
    return new Promise(async (resolve, reject) => {

        try {
            // difference b/w fromDate and ToDate < 60Days
            let instrumentID = await getInstrumentID(instrument);
            let paramsObj = await getParams();
            console.log(instrumentID);
            console.log(paramsObj)
            let userID = paramsObj.userID;
            let apikey = paramsObj.apikey;
            let accesstoken = paramsObj.accesstoken;
            // let x = parseDate(fromDate);
            console.log(fromDate.getFullYear(), timeframe, instrumentID);
            let url = "https://api.kite.trade/instruments/historical/" + instrumentID.toString() + "/" + timeframe.toString() + "?user_id=" + userID.toString() + "&oi=1&from=" + parseDate(fromDate) + "&to=" + parseDate(toDate);


            let res = await fetch(url, {
                method: "GET",
                headers: {
                    "authorization": "token " + apikey + ":" + accesstoken
                }
            })


            res = await res.json();

            if (res.status == "success") {
                resolve(res['data']['candles']);
            } else {
                logger.error(res);
                reject(res);
            }

        } catch (err) {
            logger.error({ "fetchCandlesData()": err });
            reject(err);
        };
    })

}

function getTodaysCandle(instrument, timeframe) {

    logger.info({ "function": " getCandles(" + candlesCount + ")", "instrument": instrument, "timeframe": timeframe });
    return new Promise(async (resolve, reject) => {


        let today = new Date();


        try {
            //-------------------Fetching Reuired Candles of D/F Interval-----------------------------//
            let candlesData = await fetchCandlesData(instrument, timeframe, today, today);
            console.log(candlesData);
            resolve(candlesData);

        } catch (err) {
            logger.info(err);
            reject(err);
        }
    });
}


function waitForTime(entryHour, entryMinute, entrySecond) {

    return new Promise(async (resolve, reject) => {

        while (1) {
            var dt = new Date();


            if (dt.getHours() > entryHour ||
                (dt.getHours() == entryHour && dt.getMinutes() > entryMinute) ||
                (dt.getHours() == entryHour && dt.getMinutes() >= entryMinute && dt.getSeconds() >= entrySecond)) {
                // print( { message : " Strategy Start Time Reached starting BNF Express ", time : dt.toLocaleTimeString()  });
                resolve(true);
                break;
            } else {
                //print("waiting for " , 1000 - (new Date()).getMilliseconds()  );
                await waitForXseconds(1 - (new Date()).getMilliseconds() / 1000);
            }
        }
    });
}
//------------------------------------------------------------------------------//


function getInstrumentID(instrument) {

    return new Promise(async (resolve, reject) => {
        try {
            symb = instrument.split(":")[1];
            logger.info(symb, instrumentID[symb]);
            resolve(instrumentID[symb]);
        } catch (err) {
            logger.info("Error while fetching InstrumentID  \n ", err);
            reject(err);
        }
    });
}

function findLTPthroughQuote(apiKey, accessToken, symbol) {

    return new Promise(async (resolve, reject) => {

        var url = "https://api.kite.trade/quote/ltp/?&i=" + symbol; //   &i=NFO:BANKNIFTY20DECFUT ;  add this to url for each instrument
        var options = {
            method: 'GET',
            headers: {
                "Authorization": "token " + apiKey + ":" + accessToken,
                "X-Kite-Version": 3
            }
        }

        var res = await fetch(url, options);
        var doc = await res.json();

        if (doc['status'] == 'success' && !isEmptyDict(doc['data'])) {
            var ltp = doc['data'][symbol]['last_price'];
            resolve(ltp);
        } else {
            logger.info("Error:2 => Rejecting in findLTPthroughQuote ");
            logger.error(doc);
            reject(doc);
        }

    })

}

function getTokenList(apiKey, accessToken, instrumentList) {

    logger.info("Inside getTokenList() ");

    var fixedTokens = {
        "INDIA VIX": 264969,
    }

    return new Promise(async (resolve, reject) => {

        var url = "https://api.kite.trade/quote/?"; //   &i=NFO:NIFTY20D0312900CE ;  add this to url for each instrument

        instrumentList.forEach((instrument) => {
            url += "&i=" + instrument;
        })

        var options = {
            method: 'GET',
            headers: {
                "Authorization": "token " + apiKey + ":" + accessToken,
                "X-Kite-Version": 3
            }
        }

        var res = await fetch(url, options);

        var doc = await res.json();

        if (doc['status'] == 'success') {

            var tokensList = {};

            instrumentList.forEach(instrument => {
                if (instrument in doc['data']) {
                    var inst_token = doc['data'][instrument].instrument_token;
                    tokensList[inst_token] = instrument;
                }
            })

            // Add fixed Tokens to the list without exhange in font 
            Object.keys(fixedTokens).forEach(k => {
                v = fixedTokens[k]
                tokensList[v] = k;
            })

            resolve(tokensList);
        } else {
            logger.error("#1 : Error in fetching Quotes ", doc);
            reject("#11 Err in findQuote");
        }


    })

}

function checkToken(apiKey, accessToken) {

    return new Promise(async (resolve, reject) => {
        var url = "https://api.kite.trade/quote/?i=NSE:RELIANCE"; //   &i=NFO:NIFTY20D0312900CE ;  add this to url for each instrument
        var options = {
            method: 'GET',
            headers: {
                "Authorization": "token " + apiKey + ":" + accessToken,
                "X-Kite-Version": 3
            }
        }

        try {
            var res = await fetch(url, options);
            var doc = await res.json();
        } catch {
            reject(false);
        }

        if (doc['status'] == 'success') {
            //utils.print("Token Details are Valid !!");
            resolve(true);
        } else {
            //utils.print("Token Details are InValid !!");
            resolve(false);
        }

    })
}

function getParams() {
    return new Promise(async (resolve, reject) => {
        try {
            var paramsObj = await params.findOne({});
            resolve(paramsObj);
        } catch (err) {
            logger.info("Error while fetching Expiry Details through DB ", err);
            reject(err);
        }
    })

}

async function getClientPositions(userID, apiKey, accessToken) {
    try {

        let positions = await zerodhaTrade.getClientPositions({
            userID,
            apiKey,
            accessToken,
        });
        if (positions) {
            res.json(positions);
        }
        else {
            res.json({ message: "Positions not found" });
        }

    } catch (error) {
        res.json({ message: error });
    }
}

function getLTP(instrument) {
    return new Promise(async (resolve, reject) => {
        let url = LIVEPRICES_URL + "/api/LTP?instrument=" + instrument;
        try {
            let res = await fetch(url);
            res = await res.json();
            if (res['status'] == 'success') {
                resolve(res['ltp']);
            } else {
                print("ERROR-log", res);
                reject(res);
            }
        } catch (err) {
            print("ERROR-log", err);
            reject(err);
        }
    })
}

async function placeTrade(account, userID, apiKey, accessToken, instrument, t_type, order_type, product, trigger_price, qty, price) {
    try {
        let order = await zerodhaTrade.placeTrade(
            userID,
            apiKey,
            accessToken,
            instrument,
            t_type,
            order_type,
            product,
            trigger_price,
            qty,
            price,

        );
        if (order) {
            let newTrade = {
                instrument: instrument,
                product: product,
                t_type: t_type,
                order_type: order_type,
                price: price,
                overallQty: quantity,
                account: account,
                status: "SUCCESS",
                time: Date.now(),
            }
            let x = await fetch(`http://localhost:8000/api/trades/createTrade`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",

                },
                body: JSON.stringify(newTrade),
            })
            if (x) {
                console.log("success")
            }
            res.json(order);
        }
        else {
            res.json({ message: "Order not placed" });
        }
    } catch (error) {
        res.json({ message: error });
    }
}

async function loginZerodha(userID, apiKey, pin, password, auth_type, secret, totp_secret) {
    try {
        let login = await zerodhaLogin.getZerodhaAccessToken({ userID, apiKey, pin, password, auth_type, secret, totp_secret });
        if (login) {
            res.json(login);
        }
        else {
            res.json({ message: "Login Failed" });
        }
    } catch (error) {
        res.json({ message: error });
    }
}


module.exports["placeTrade"] = placeTrade;
module.exports["getClientPositions"] = getClientPositions;
module.exports['print'] = print;
module.exports['getLTP'] = getLTP;
module.exports['waitForXseconds'] = waitForXseconds;
module.exports['getParams'] = getParams;
module.exports['getInstrumentID'] = getInstrumentID;
module.exports['getTokenList'] = getTokenList;
module.exports['checkToken'] = checkToken;
module.exports['findLTPthroughQuote'] = findLTPthroughQuote;
module.exports['waitForTime'] = waitForTime;
module.exports['getTodaysCandle'] = getTodaysCandle;
module.exports["fetchCandlesData"] = fetchCandlesData
module.exports["loginZerodha"] = loginZerodha;