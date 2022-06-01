
const fetch = require("isomorphic-fetch");
const zerodhaTrade = require('../broker/zerodha/trade');
const placeTrade = require('../broker/zerodha/placeTrade')
const Indicators = require('../indicators')
const credData = require('../data/credentials.json');
const Utils = require('../utils');

let apiKey = credData.api_key;
let accessToken = credData.access_token;


const getAllAccounts = () => {


    return fetch(`http://localhost:8000/api/strategies/getAllStrategiesForExecution`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

        },
    })
        .then((res) => {
            console.log(res)
            return res.json();
        })
        .catch((err) => {
            return err;
        });
}


async function main() {
    try {
        let strategies = await getAllAccounts();
        console.log("strategies")
        console.log(strategies);
        for (let i = 0; i < 1; i++) {
            strategyCustom(strategies[i]);
        }
    } catch (error) {
        console.log(error);
    }
}

async function strategyCustom(strategy) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(strategy)
            Utils.print("Strategy started", strategy.name)
            let entryTime = new Date(strategy.entryTime);

            let entryHour = entryTime.getHours();
            let entryMinute = entryTime.getMinutes();

            let exitTime = new Date(strategy.exitTime);
            const exitHour = exitTime.getHours();
            const exitMinute = exitTime.getMinutes();

            let instrument = "NSE:" + strategy.instrument1;
            let symbol = strategy.instrument2;
            let timeFrame = strategy.timeFrame;
            let account = strategy.account;
            let direction = strategy.direction;
            let orderType = strategy.orderType;
            let indicator1 = strategy.indicator1;
            let period1 = strategy.period1;
            let multiplier1 = strategy.multiplier1;
            let quantity = strategy.quantity;
            let stopLoss = strategy.stopLoss;
            let target = strategy.target;
            let indicator2 = strategy.indicator2;
            let period2 = strategy.period2;
            let multiplier2 = strategy.multiplier2;
            let candleParam1 = strategy.candleParam1;
            let candleParam2 = strategy.candleParam2;
            let condition = strategy.condition;
            let stopLossunit = strategy.stopLossunit;
            let targetunit = strategy.targetunit;

            let candleIndex1
            if (candleParam1 === "open") {
                candleIndex1 = 1;
            } else if (candleParam1 === "high") {
                candleIndex1 = 2;
            } else if (candleParam1 === "low") {
                candleIndex1 = 3;
            } else if (candleParam1 === "close") {
                candleIndex1 = 4;
            }
            let candleIndex2

            if (candleParam2 === "open") {
                candleIndex2 = 1;
            } else if (candleParam2 === "high") {
                candleIndex2 = 2;
            } else if (candleParam2 === "low") {
                candleIndex2 = 3;
            } else if (candleParam2 === "close") {
                candleIndex2 = 4;
            }

            console.log(account);
            let currentTime = new Date();
            // await Utils.waitForTime(entryHour, entryMinute, 0);
            let indicator1Data, indicator2Data
            while (1) {
                if (indicator1 == "sma") {
                    try {
                        indicator1Data = await Indicators.sma({
                            instrument: symbol,
                            timeFrame,
                            period: period1,
                            candleParam: candleParam1
                        });
                        Utils.print("indicator1Data", indicator1Data)
                    } catch (error) {
                        console.log("Errorrr");
                        console.log(error);
                    }
                }
                if (indicator2 == "candle") {
                    try {
                        let x = await Utils.getTodaysCandle(

                            symbol,
                            timeFrame
                        );
                        // Utils.print("x", x)
                        indicator2Data = x[x.length - 1][candleParam2];
                        Utils.print("indicator2Data", indicator2Data)
                    } catch (error) {
                        console.log(error);
                    }
                }
                if (indicator2 == "sma") {
                    try {
                        indicator2Data = await Indicators.sma({
                            instrument: symbol,
                            apiKey: apiKey,
                            accessToken: accessToken,
                            timeFrame,
                            period: period2,
                            candleParam: candleParam2
                        });
                        Utils.print("indicator2Data", indicator2Data)
                    } catch (error) {
                        console.log(error);
                    }
                }
                if (condition == "crossabove") {
                    if (indicator1Data < indicator2Data) {
                        console.log("crossabove");
                        try {

                            let order = await zerodhaTrade.placeTrade({
                                "account": account._id,
                                "userID": account.userID,
                                "apiKey": apiKey,
                                "accessToken": accessToken,
                                "t_type": "SELL",
                                "instrument": symbol,
                                "qty": quantity,
                                "product": orderType,
                                "order_type": "MARKET",
                                "price": 0,
                                "trigger_price": 0
                            })

                            Utils.print("order", order)
                            await checkForSLandTarget(symbol, account, stopLoss, target, direction, quantity, orderType, stopLossunit, targetunit, exitHour, exitMinute, timeFrame);
                        } catch (error) {
                            console.log(error);
                        }

                        console.log(order);
                        break;
                    }
                }
                if (condition == "crossbelow") {
                    if (indicator1Data > indicator2Data) {
                        console.log("crossbelow");

                        try {
                            let order = await zerodhaTrade.placeTrade({
                                "account": account._id,
                                "userID": account.userID,
                                "apiKey": apiKey,
                                "accessToken": accessToken,
                                "t_type": "SELL",
                                "instrument": symbol,
                                "qty": quantity,
                                "product": orderType,
                                "order_type": "MARKET",
                                "price": 0,
                                "trigger_price": 0
                            })
                            Utils.print("order", order)
                            await checkForSLandTarget(symbol, account, stopLoss, target, direction, quantity, orderType, stopLossunit, targetunit, exitHour, exitMinute, timeFrame);
                        } catch (error) {
                            console.log(error);
                        }
                        console.log(order);
                        break;
                    }
                }
                if (condition == "crossover") {
                    if (indicator1Data < indicator2Data || indicator1Data > indicator2Data) {
                        console.log("crossover");
                        try {
                            let order = await placeTrade(
                                account._id,
                                "OU8828",
                                // account.userID,
                                account.apiKey,
                                account.enctoken,
                                symbol,
                                direction,
                                quantity,
                                "MARKET",
                                orderType,
                                0,
                                0
                            )
                            Utils.print("order", order)
                            await checkForSLandTarget(symbol, account, stopLoss, target, direction, quantity, orderType, stopLossunit, targetunit, exitHour, exitMinute, timeFrame)
                        } catch (error) {
                            console.log(error);
                        }
                        console.log(order);
                        break;
                    }
                }
                if (currentTime.getHours() == exitHour && currentTime.getMinutes() == exitMinute) {
                    break;
                }
                currentTime = new Date();
                await Utils.waitForXseconds(1);
            }
        } catch (error) {
            reject(error);
        }
    });
}


async function checkForSLandTarget(symbol, account, stopLoss, target, direction, quantity, orderType, stopLossunit, targetunit, exitHour, exitMinute, timeFrame) {
    return new Promise(async (resolve, reject) => {
        try {
            let SL, targetPrice, LTP;

            LTP = await Utils.getLTP(symbol)
            console.log("LTP", LTP);
            let currentTime = new Date();
            if (stopLossunit == "%" && direction == "BUY") {
                SL = LTP - LTP * +stopLoss / 100;
            }
            if (stopLossunit == "%" && direction == "SELL") {
                SL = LTP + LTP * +stopLoss / 100;
            }
            if (stopLossunit == "Rs" && direction == "BUY") {
                SL = LTP - +stopLoss;
            }
            if (stopLossunit == "Rs" && direction == "SELL") {
                SL = LTP + +stopLoss;
            }
            if (targetunit == "%" && direction == "BUY") {
                targetPrice = LTP + LTP * +target / 100;
            }
            if (targetunit == "%" && direction == "SELL") {
                targetPrice = LTP - LTP * +target / 100;
            }
            if (targetunit == "Rs" && direction == "BUY") {
                targetPrice = LTP + +target;
            }
            if (targetunit == "Rs" && direction == "SELL") {
                targetPrice = LTP - +target;
            }
            Utils.print("checking exit for ", symbol);
            Utils.print("SL", SL);
            Utils.print("targetPrice", targetPrice);
            while (1) {

                LTP = await Utils.getLTP(symbol)
                Utils.print("checking exit for ", symbol, LTP);
                if (direction == "BUY") {
                    if (LTP < SL) {
                        try {

                            Utils.print('Stoploss hit')
                            let order = await placeTrade(
                                account._id,
                                "OU8828",
                                // account.userID,
                                account.apiKey,
                                account.enctoken,
                                symbol,
                                "SELL",
                                quantity,
                                "MARKET",
                                orderType,
                                0,
                                0
                            )
                            Utils.print("order", order)
                            console.log(order);
                            break;
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    if (LTP > targetPrice || (currentTime.getHours() == exitHour && currentTime.getMinutes() >= exitMinute)) {
                        try {
                            Utils.print("Target hit")
                            let order = await placeTrade(
                                account._id,
                                "OU8828",
                                // account.userID,
                                account.apiKey,
                                account.enctoken,
                                symbol,
                                "SELL",
                                quantity,
                                "MARKET",
                                orderType,
                                0,
                                0
                            )
                            console.log(order);
                            break;
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
                if (direction == "SELL") {
                    if (LTP > SL) {
                        try {
                            Utils.print('Stoploss hit')
                            let order = await placeTrade(
                                account._id,
                                "OU8828",
                                // account.userID,
                                account.apiKey,
                                account.enctoken,
                                symbol,
                                "SELL",
                                quantity,
                                "MARKET",
                                orderType,
                                0,
                                0
                            )
                            console.log(order);
                            break;
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    if (LTP < targetPrice || (currentTime.getHours() == exitHour && currentTime.getMinutes() >= exitMinute)) {
                        try {
                            Utils.print("Target hit")
                            let order = await placeTrade(
                                account._id,
                                "OU8828",
                                // account.userID,
                                account.apiKey,
                                account.enctoken,
                                symbol,
                                "SELL",
                                quantity,
                                "MARKET",
                                orderType,
                                0,
                                0
                            )
                            console.log(order);
                            break;
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
                currentTime = new Date();
                await Utils.waitForXseconds(1);
            }
        } catch (error) {
            reject(error);
        }
    });
}



main();

