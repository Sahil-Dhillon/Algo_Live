const fetch = require("isomorphic-fetch");
const zerodhaTrade = require("../broker/zerodha/trade");
const Strategy = require("../models/strategies");
const Order = require("../models/orders");
const futureTables = require("../models/futureTables");
const { placeTrade, getOrder } = require("../broker/zerodha/placeTrade");
const Indicators = require("../indicators");
const credData = require("../data/credentials.json");
const Utils = require("../utils");
const URL = process.env.BACKEND_URL;
let apiKey = credData.api_key;
let accessToken = credData.access_token;

const getAllStrategiesForExecution = async () => {
  try {
    let strategies = await Strategy.find({ active: true })
      .populate("user")
      .populate("account");
    return strategies;
  } catch (error) {
    return error;
  }
};

const evaluateIndicatorValue = async (
  indicator,
  instrument,
  timeFrame,
  period,
  multiplier,
  candleParam
) => {
  console.log(
    indicator,
    instrument,
    timeFrame,
    period,
    multiplier,
    candleParam
  );
  if (indicator === "sma") {
    try {
      indicatorData = await Indicators.sma({
        instrument: instrument,
        timeFrame,
        period: period,
        candleParam: candleParam,
      });
      return indicatorData;
    } catch (error) {
      console.log("Errorrr");
      console.log(error);
    }
  } else if (indicator === "candle") {
    try {
      let x = await Utils.getTodaysCandle(instrument, timeFrame);
      // Utils.print("x: ", x)
      indicatorData = x[x.length - 1][candleParam];
      return indicatorData;
    } catch (error) {
      console.log(error);
    }
  } else if (indicator === "vwap") {
    try {
      indicatorData = await Indicators.vwap({
        instrument: instrument,
        timeFrame,
        period: period,
        candleParam: candleParam,
      });
      return indicatorData;
    } catch (error) {
      console.log("Errorrr");
      console.log(error);
    }
  } else if (indicator === "supertrend") {
    try {
      indicatorData = await Indicators.superTrend({
        instrument: instrument,
        timeFrame,
        period: period,
        multiplier,
        candleParam: candleParam,
      });
      return indicatorData;
    } catch (error) {
      console.log("Errorrr");
      console.log(error);
    }
  } else if (indicator === "chandeMomentum") {
    try {
      indicatorData = await Indicators.cmo({
        instrument: instrument,
        timeFrame,
        period: period,
        candleParam: candleParam,
      });
      return indicatorData;
    } catch (error) {
      console.log("Errorrr");
      console.log(error);
    }
  } else if (indicator === "centerOfGravity") {
    try {
      indicatorData = await Indicators.cog({
        instrument: instrument,
        timeFrame,
        period: period,
        candleParam: candleParam,
      });
      return indicatorData;
    } catch (error) {
      console.log("Errorrr");
      console.log(error);
    }
  } else if (indicator === "fisherTransform") {
    try {
      indicatorData = await Indicators.ft({
        instrument: instrument,
        timeFrame,
        period: period,
        candleParam: candleParam,
      });
      return indicatorData;
    } catch (error) {
      console.log("Errorrr");
      console.log(error);
    }
  } else if (indicator === "rsi") {
    try {
      indicatorData = await Indicators.rsi({
        instrument: instrument,
        timeFrame,
        period: period,
        candleParam: candleParam,
      });
      return indicatorData;
    } catch (error) {
      console.log("Errorrr");
      console.log(error);
    }
  } else if (indicator === "macd") {
    try {
      indicatorData = await Indicators.macd({
        instrument: instrument,
        timeFrame,
        period: period,
        candleParam: candleParam,
      });
      return indicatorData;
    } catch (error) {
      console.log("Errorrr");
      console.log(error);
    }
  } else if (indicator === "ema") {
    try {
      indicatorData = await Indicators.ema({
        instrument: instrument,
        timeFrame,
        period: period,
        candleParam: candleParam,
      });
      return indicatorData;
    } catch (error) {
      console.log("Errorrr");
      console.log(error);
    }
  }

  // if (indicator2 == "sma") {
  //     try {
  //         indicator2Data = await Indicators.sma({
  //             instrument: instrument2,
  //             apiKey: apiKey,
  //             accessToken: accessToken,
  //             timeFrame,
  //             period: period2,
  //             candleParam: candleParam2
  //         });
  //         Utils.print("indicator2Data", indicator2Data)
  //     } catch (error) {
  //         console.log(error);
  //     }
  // }
};

async function main() {
  try {
    let strategies = await getAllStrategiesForExecution();
    // console.log("strategies: ", strategies);
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
      console.log(strategy);

      Utils.print("Strategy started: ", strategy.name);

      let entryTime = new Date(strategy.entryTime);

      const entryHour = entryTime.getHours();
      const entryMinute = entryTime.getMinutes();

      let exitTime = new Date(strategy.exitTime);
      const exitHour = exitTime.getHours();
      const exitMinute = exitTime.getMinutes();

      // let instrument = "NSE:" + strategy.instrument1;

      const candleParam = "close";
      let indicators = strategy.indicators;
      let exchange = strategy.exchange;
      let dataSymbol = strategy.dataSymbol;
      let orderSymbol = strategy.orderSymbol;
      let timeFrame = strategy.timeFrame;
      let account = strategy.account;
      let direction = strategy.direction;
      let orderType = strategy.orderType;

      let quantity = strategy.quantity;
      let stopLoss = strategy.stopLoss;
      let target = strategy.target;

      let stopLossUnit = strategy.stopLossUnit;
      let targetUnit = strategy.targetUnit;
      let trailSLYPoint = strategy.trailSLYPoint;
      let trailSLXPoint = strategy.trailSLXPoint;

      let transformedOrderSymbol;

      let indicatorValues = [];

      let price;
      let orderStatus;

      // console.log(account);
      await Utils.waitForTime(entryHour, entryMinute, 0);

      if (orderSymbol.includes("BANKNIFTY")) {
        transformedOrderSymbol = "BANKNIFTY";
      } else {
        transformedOrderSymbol = "NIFTY";
      }

      // access todays date
      const todaysDate = new Date();
      // set todays date to 12:00 midnight
      todaysDate.setHours(0, 0, 0, 0);

      await futureTables
        .find({ date: { $gt: todaysDate } })
        .sort("date")
        .then((dates) => {
          let fut_name = dates[0].name.toUpperCase();

          transformedOrderSymbol = "NFO:" + transformedOrderSymbol + fut_name;
        });

      console.log("Symbol to be ordered: ", transformedOrderSymbol);

      while (1) {
        let currentTime = new Date();

        if (
          currentTime.getHours() >= exitHour &&
          currentTime.getMinutes() >= exitMinute
        ) {
          Utils.print("Strategy exitted");
          break;
        }

        let indicatorResults = [];

        try {
          for (let i = 0; i < indicators.length; i++) {
            const indicator = indicators[i];

            let indicatorName = indicator.indicator;
            let operator1 = indicator.operator1;
            let operator2 = indicator.operator2;
            let param1 = indicator.param1;
            let param2 = indicator.param2;
            let buyValue = indicator.value1;
            let sellValue = indicator.value2;

            let shouldBuy, shouldSell;

            let comparator;

            console.log(
              indicatorName,
              operator1,
              operator2,
              param1,
              param2,
              buyValue,
              sellValue
            );

            let result = await evaluateIndicatorValue(
              indicatorName,
              orderSymbol,
              timeFrame,
              param1,
              param2,
              candleParam
            );

            console.log("Indicator Result: ", result);

            if (direction === "BOTH") {
              if (operator1 === "greater") {
                if (result > buyValue) {
                  indicatorResults.push(result > buyValue);
                  shouldBuy = true;
                }
              } else if (operator1 === "less") {
                if (result < buyValue) {
                  indicatorResults.push(result < buyValue);
                  shouldBuy = true;
                }
              } else if (operator1 === "signal") {
                // idk what to do here
              }

              if (operator2 === "greater") {
                if (result > sellValue) {
                  indicatorResults.push(result > sellValue);
                  shouldSell = true;
                }
              } else if (operator2 === "less") {
                if (result < sellValue) {
                  indicatorResults.push(result > sellValue);
                  shouldSell = true;
                }
              } else if (operator2 === "signal") {
                // idk what to do here
              }
            } else {
              if (direction === "BUY") {
                comparator = buyValue;
              } else if (direction === "SELL") {
                comparator = sellValue;
              }

              if (operator1 === "greater") {
                indicatorResults.push(result > comparator);
              } else if (operator1 === "less") {
                indicatorResults.push(result < comparator);
              } else if (operator1 === "signal") {
                // idk what to do here
              }
            }
          }
          console.log(indicatorResults);
        } catch (error) {
          console.log("Error occured in evaluating strategies!");
          console.log(error);
        }

        let shouldOrder =
          indicatorResults.every((element) => element === true) &&
          indicatorResults.length > 0;

        console.log("Whether we are going to order or not: ", shouldOrder);

        if (shouldOrder) {
          if (direction !== "BOTH") {
            let message = direction === "BUY" ? "Buying" : "Selling";
            console.log(message);
            try {
              const entryOrder = await makeOrder(
                account,
                transformedOrderSymbol,
                direction,
                quantity,
                orderType,
                exchange,
                "Indicator entry"
              );

              price = entryOrder.price;
              orderStatus = direction === "BUY" ? "Bought" : "Sold";

              Utils.print("Entry Order: ", entryOrder);
            } catch (error) {
              console.log(error);
            }
          } else if (direction === "BOTH") {
            if (shouldBuy) {
              let message = "Buying";
              console.log(message);
              try {
                const entryOrder = await makeOrder(
                  account,
                  transformedOrderSymbol,
                  "BUY",
                  quantity,
                  orderType,
                  exchange,
                  "Indicator entry"
                );

                price = entryOrder.price;
                orderStatus = "Bought";

                Utils.print("Entry Order: ", entryOrder);
              } catch (error) {
                console.log(error);
              }
            } else if (shouldSell) {
              let message = "Selling";
              console.log(message);
              try {
                const entryOrder = await makeOrder(
                  account,
                  transformedOrderSymbol,
                  "SELL",
                  quantity,
                  orderType,
                  exchange,
                  "Indicator entry"
                );

                price = entryOrder.price;
                orderStatus = "Sold";

                Utils.print("Entry Order: ", entryOrder);
              } catch (error) {
                console.log(error);
              }
            }
          }

          const exitOrder = await checkForSLandTarget(
            transformedOrderSymbol,
            account,
            stopLoss,
            target,
            direction,
            quantity,
            price,
            orderType,
            exchange,
            stopLossUnit,
            targetUnit,
            exitHour,
            exitMinute,
            timeFrame,
            orderStatus
          );

          console.log("Exit Order: ", exitOrder);
          break;
        }

        if (
          currentTime.getHours() == exitHour &&
          currentTime.getMinutes() == exitMinute
        ) {
          break;
        }
        await Utils.waitForXseconds(1);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function checkForSLandTarget(
  orderSymbol,
  account,
  stopLoss,
  target,
  direction,
  quantity,
  price,
  orderType,
  exchange,
  stopLossunit,
  targetunit,
  exitHour,
  exitMinute,
  timeFrame,
  orderStatus
) {
  return new Promise(async (resolve, reject) => {
    try {
      let SL, targetPrice, LTP;

      let exitOrder;

      console.log("In SL");
      // LTP = await Utils.getLTP(symbol);
      // console.log("LTP: ", LTP);

      if (direction !== "BOTH") {
        if (stopLossunit == "%" && direction == "BUY") {
          SL = price - (price * +stopLoss) / 100;
        }
        if (stopLossunit == "%" && direction == "SELL") {
          SL = price + (price * +stopLoss) / 100;
        }
        if (stopLossunit == "Rs" && direction == "BUY") {
          SL = price - +stopLoss;
        }
        if (stopLossunit == "Rs" && direction == "SELL") {
          SL = price + +stopLoss;
        }

        if (targetunit == "%" && direction == "BUY") {
          targetPrice = price + (price * +target) / 100;
        }
        if (targetunit == "%" && direction == "SELL") {
          targetPrice = price - (price * +target) / 100;
        }
        if (targetunit == "Rs" && direction == "BUY") {
          targetPrice = price + +target;
        }
        if (targetunit == "Rs" && direction == "SELL") {
          targetPrice = price - +target;
        }
      } else {
        if (stopLossunit == "%" && orderStatus == "Bought") {
          SL = price - (price * +stopLoss) / 100;
        }
        if (stopLossunit == "%" && orderStatus == "Sold") {
          SL = price + (price * +stopLoss) / 100;
        }
        if (stopLossunit == "Rs" && orderStatus == "Bought") {
          SL = price - +stopLoss;
        }
        if (stopLossunit == "Rs" && orderStatus == "Sold") {
          SL = price + +stopLoss;
        }

        if (targetunit == "%" && orderStatus == "Bought") {
          targetPrice = price + (price * +target) / 100;
        }
        if (targetunit == "%" && orderStatus == "Sold") {
          targetPrice = price - (price * +target) / 100;
        }
        if (targetunit == "Rs" && orderStatus == "Bought") {
          targetPrice = price + +target;
        }
        if (targetunit == "Rs" && orderStatus == "Sold") {
          targetPrice = price - +target;
        }
      }

      Utils.print("checking exit for ", orderSymbol);
      Utils.print("SL: ", SL);
      Utils.print("targetPrice: ", targetPrice);

      while (1) {
        LTP = 1;
        // await Utils.getLTP(orderSymbol);
        Utils.print("checking exit for ", orderSymbol, LTP);

        let currentTime = new Date();

        if (
          currentTime.getHours() == exitHour &&
          currentTime.getMinutes() >= exitMinute
        ) {
          Utils.print("Exit Time Reached!");
          if (orderStatus === "Bought") {
            exitOrder = await makeOrder(
              account,
              orderSymbol,
              "SELL",
              quantity,
              orderType,
              exchange,
              "Exit Time Reached"
            );
            // Utils.print("Exit Order: ", exitOrder);
          } else if (orderStatus === "Sold") {
            exitOrder = await makeOrder(
              account,
              orderSymbol,
              "BUY",
              quantity,
              orderType,
              exchange,
              "Exit Time Reached"
            );
            // Utils.print("Exit Order: ", exitOrder);
          }
          break;
        }
        if (orderStatus == "Bought") {
          if (LTP < SL) {
            try {
              Utils.print("Stoploss hit");
              exitOrder = await makeOrder(
                account,
                orderSymbol,
                "SELL",
                quantity,
                orderType,
                exchange,
                "Stoploss Hit"
              );
              // Utils.print("Exit Order: ", exitOrder);
              break;
            } catch (error) {
              console.log(error);
            }
          } else if (LTP > targetPrice) {
            try {
              Utils.print("Target hit");
              exitOrder = await makeOrder(
                account,
                orderSymbol,
                "SELL",
                quantity,
                orderType,
                exchange,
                "Target Hit"
              );
              // Utils.print("Exit Order: ", exitOrder);
              break;
            } catch (error) {
              console.log(error);
            }
          }
          // else if (direction === "BOTH") {
          //   if (operator2 === "Greater") {
          //     if(LTP > sellValue) {
          //       //sell
          //     }
          //   } else if(operator2 === "Less") {
          //     if(LTP < sellValue) {
          //       //sell
          //     }
          //   }
          // }
        }
        if (orderStatus == "Sold") {
          if (LTP > SL) {
            try {
              Utils.print("Stoploss hit");
              exitOrder = await makeOrder(
                account,
                orderSymbol,
                "BUY",
                quantity,
                orderType,
                exchange,
                "Stoploss Hit"
              );
              // Utils.print("Exit Order: ", exitOrder);
              break;
            } catch (error) {
              console.log(error);
            }
          } else if (LTP < targetPrice) {
            try {
              Utils.print("Target hit");
              exitOrder = await makeOrder(
                account,
                orderSymbol,
                "SELL",
                quantity,
                orderType,
                exchange,
                "Target Hit"
              );
              // Utils.print("Exit Order: ", exitOrder);
              break;
            } catch (error) {
              console.log(error);
            }
          }
        }

        await Utils.waitForXseconds(1);
      }

      resolve(exitOrder);
    } catch (error) {
      reject(error);
    }
  });
}

const makeOrder = async (
  account,
  transformedOrderSymbol,
  direction,
  quantity,
  orderType,
  exchange,
  remarks
) => {
  let order = await placeTrade(
    account._id,
    account.userID,
    account.apiKey,
    account.enctoken,
    transformedOrderSymbol,
    direction,
    quantity,
    "MARKET",
    orderType,
    0,
    0
  );

  let orderHistory = await getOrder(
    account,
    account.userID,
    account.enctoken,
    order.data.order_id
  );

  let price = orderHistory.data[orderHistory.data.length - 1].average_price;

  let orderDetails = new Order({
    user: account.user,
    account: account._id,
    orderId: order.data.order_id,
    exchange: exchange,
    orderSymbol: transformedOrderSymbol,
    orderType: orderType,
    direction: direction,
    price: price,
    quantity: quantity,
    remarks: remarks,
  });

  const newOrder = await orderDetails.save();

  return newOrder;
};

main();
