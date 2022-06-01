const logger = require("pino")();

const utils = require("../utils");
module.exports = app => {

    app.get('/', async (req, res) => {
        res.json({ "status": "success", "message": "API is working" });
    })

    app.get('/api', async (req, res) => {
        res.json({ "status": "success", "message": "API is working" });
    })




    app.post('/api/getClientPositions', async (req, res) => {
        try {
            let userID = req.body.userId;
            let apiKey = req.body.apiKey;
            let accessToken = req.body.accessToken;
            let positions = await utils.getClientPositions(userID, apiKey, accessToken);
            res.json({ "status": "success", "positions": positions });
        } catch (err) {
            res.json({ "status": "error", "message": err });
        }
    })

    app.get('/api/getCandlesData', async (req, res) => {
        try {
            let instrument = req.query.instrument;
            let fromDate = new Date(req.query.from);    // yyyy-mm-dd
            let toDate = new Date(req.query.to);      // yyyy-mm-dd
            let timeframe = req.query.timeframe == undefined ? "minute" : req.query.timeframe;
            let candles = await utils.fetchCandlesData(instrument, timeframe, fromDate, toDate);

            res.json({ "status": "success", "data": candles });
        } catch (err) {
            res.json({ "status": "error", "message": err });
        }
    })




    app.get('/api/getInstrumentID', async (req, res) => {
        try {
            let instrumentID = await utils.getInstrumentID(req.query.instrument);
            res.json(instrumentID);
        } catch (err) {
            res.json(err);
        }
    })

    app.post('/api/placeTrade', async (req, res) => {
        console.log("rebody", req.body);
        try {

            let account = req.body.account;
            let userID = req.body.userID;
            let apiKey = req.body.apiKey;
            let accessToken = req.body.accessToken;
            let instrument = req.body.instrument;
            let t_type = req.body.t_type;
            let order_type = req.body.order_type;
            let product = req.body.product;
            let trigger_price = req.body.trigger_price;
            let qty = req.body.qty;
            let price = req.body.price;
            let order = await utils.placeTrade(account, userID, apiKey, accessToken, instrument, t_type, order_type, product, trigger_price, qty, price);
            res.json({ "status": "success", "data": order });
        } catch (err) {
            res.json({ "status": "error", "message": err });
        }
    })


    app.post('/api/zerodha/login', async (req, res) => {
        console.log("rebody", req.body);
        try {


            let userID = req.body.userID;
            let apiKey = req.body.apiKey;
            let pin = req.body.pin;
            let password = req.body.password;
            let auth_type = req.body.auth_type
            let secret = req.body.secret;
            let totp_secret = req.body.totp_secret;

            let token = await utils.loginZerodha(userID, apiKey, pin, password, auth_type, secret, totp_secret);
            res.json({ "status": "success", "data": token });
        } catch (err) {
            res.json({ "status": "error", "message": err });
        }
    })

}