const logger = require("pino")();
const subs_0 = require("./subs_options");
const subs_1 = require("./subs_futures");
const subs_2 = require("./subs_stocks");

logger.info("./subscribe/index.js file Loaded sucessfully!!");

function getLTP(instrument) {

    logger.info("getLTP()" + instrument);
    logger.info({
        "subs_0": subs_0.getLTP(instrument),
        "subs_1": subs_1.getLTP(instrument),
        "subs_2": subs_2.getLTP(instrument)
    });

    if (subs_0.getLTP(instrument) == -1) {
        if (subs_1.getLTP(instrument) == -1) {
            return subs_2.getLTP(instrument);
        } else {
            return subs_1.getLTP(instrument)
        }
    } else {
        console.log(" Returning -------", subs_0.getLTP(instrument));
        return subs_0.getLTP(instrument)
    }
}
function getVWAP(instrument) {
    if (subs_0.getVWAP(instrument) != -1) {
        if (subs_1.getVWAP(instrument) == -1) {
            return subs_2.getVWAP(instrument);
        } else {
            return subs_1.getVWAP(instrument)
        }
    } else {
        return subs_0.getVWAP(instrument)
    }
}
function getVOL(instrument) {
    if (subs_0.getVOL(instrument) != -1) {
        if (subs_1.getVOL(instrument) == -1) {
            return subs_2.getVOL(instrument);
        } else {
            return subs_1.getVOL(instrument)
        }
    } else {
        return subs_0.getVOL(instrument)
    }
}
function getOI(instrument) {
    if (subs_0.getOI(instrument) == -1) {
        if (subs_1.getOI(instrument) == -1) {
            return subs_2.getOI(instrument);
        } else {
            return subs_1.getOI(instrument)
        }
    } else {
        return subs_0.getOI(instrument)
    }
}

module.exports['getLTP'] = getLTP;
module.exports['getVWAP'] = getVWAP;
module.exports['getVOL'] = getVOL;
module.exports['getOI'] = getOI;

