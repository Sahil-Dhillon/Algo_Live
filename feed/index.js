'use strict';
const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    logger = require('pino')();

require('dotenv').config()
const cookieParser = require("cookie-parser");
const app = express();
app.set("view engine", "ejs");
app.set('views', __dirname + "/views");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors');
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser("MY SECRET"));
app.use(express.json());


app.use(cors())

///////////////////////////////////////////////models///////////////////////////////////////////////
require("./models/admin");
require("./models/userModel");
require("./models/futures");
require("./models/simpleStockNames");
require("./models/fnoStockName");
require("./models/futureTables");
require("./models/futureData");
require("./models/optionStockNames")
require("./models/optionExpiryTable")
require("./models/options")
require("./models/optionData")

//////////////////route/////////////////////
require('./routes/API')(app);
require('./config/db')
const PORT = process.env.PORT || 4007;
const IP = "localhost";
const server = app.listen(PORT, (err) => {
    if (err) {
        logger.info("Some Error occured while starting Server ", err);
    }
    logger.info("Server Started at http://" + IP + ":" + PORT);
})
let io = require("socket.io")(server, {
    cors: {
        origin: '*',
    }
});
io.on("connection", (socket) => {
    console.log("connected at ", socket.id)
})
// require("./ticks/candles")
// require("./ticks/ticks")(io);
