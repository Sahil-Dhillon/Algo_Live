const logger = require("pino")();
const subs = require("../subscribe");
const utils = require("../utils");
const indexOptionsToSubscribe = require("../utils/optionsToSubscribe");
module.exports = app => {

    app.get('/', async (req, res) => {
        res.json({ "status": "success", "message": "API is working" });
    })

    app.get('/api', async (req, res) => {
        res.json({ "status": "success", "message": "API is working" });
    })

    app.get("/api/LTP", async (req, res) => {
        try {
            logger.info({ "route": "/api/LTP ", "query": req.query });

            let ltp = subs.getLTP(req.query.instrument);
            if (ltp != -1) {
                res.send({ "status": "success", ltp: ltp });
            } else {
                res.json({ "status": "error", "message": "ltp not found" });
            }
        } catch (err) {
            logger.error(err);
            res.json({ "status": "error", "message": err });
        }
    })

    app.get("/api/VWAP", async (req, res) => {
        try {
            logger.info({ "route": "/api/VWAP ", "query": req.query });
            let vwap = subs.getVWAP(req.query.instrument);
            if (vwap != -1) {
                res.send({ "status": "success", vwap: vwap });
            } else {
                res.json({ "status": "error", "message": "vwap not found" });
            }
        } catch (err) {
            logger.error(err);
            res.json({ "status": "error", "message": err });
        }
    })

    app.get("/api/VOL", async (req, res) => {
        try {
            logger.info({ "route": "/api/VOL ", "query": req.query });
            let vol = subs.getVOL(req.query.instrument);
            if (vol != -1) {
                res.send({ "status": "success", vol: vol });
            } else {
                res.json({ "status": "error", "message": "vol not found" });
            }
        } catch (err) {
            logger.error(err);
            res.json({ "status": "error", "message": err });
        }
    })

    app.get("/api/OI", async (req, res) => {
        try {
            logger.info({ "route": "/api/OI ", "query": req.query });
            let oi = subs.getOI(req.query.instrument);
            logger.info(" OI = " + oi);
            if (oi != -1) {
                res.send({ "status": "success", oi: oi });
            } else {
                res.json({ "status": "error", "message": "oi not found" });
            }
        } catch (err) {
            logger.error(err);
            res.json({ "status": "error", "message": err });
        }
    })
    app.get("/api/instrumentID", async (req, res) => {
        try {
            logger.info({ "route": "/api/instrumentID ", "query": req.query });
            let instrument = req.query.instrument;
            let id = await utils.getInstrumentID(instrument);
            let resObj = {};
            resObj["id"] = id;
            resObj['status'] = "success";
            res.json(resObj);

        } catch (err) {
            logger.error(err);
            res.json({ "status": "error", "message": err });
        }
    })
    app.get("/api/getTokenList", async (req, res) => {
        try {
            logger.info({ "route": "/api/getTokenList " });
            // let instrument = req.query.instrument;
            let list = await utils.getTokenList();
            res.json(list);

        } catch (err) {
            logger.error(err);
            res.json({ "status": "error", "message": err });
        }
    })
    app.get("/api/getInstrumentList", async (req, res) => {
        try {
            logger.info({ "route": "/api/instrumentID " });
            var instrumentList = await indexOptionsToSubscribe.getinstrumentsList();
            res.json(instrumentList);
        } catch (err) {
            logger.error(err);
            res.json({ "status": "error", "message": err });
        }

    })

}