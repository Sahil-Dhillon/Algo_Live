const Account = require("../models/accounts");
const zerodhaLogin = require("../broker/zerodha/login")
const zerodhaTrade = require("../broker/zerodha/trade")
const fetch = require("isomorphic-fetch");
const cron = require("node-cron")
const utils = require("../utils");
exports.addAccount = async (req, res) => {
    const {
        user,
        userID,
        auth_type,
        name,
        broker,
        password,
        pin,
        totp_secret,
        apiKey,
        secret,
        accessToken,
        enctoken,
        balance,
    } = req.body;

    let newAccount = new Account({
        user,
        userID,
        auth_type,
        name,
        broker,
        password,
        pin,
        totp_secret,
        apiKey,
        secret,
        accessToken,
        enctoken,
        balance,
    });

    try {
        const savedAccount = await newAccount.save();
        res.json(savedAccount);
    } catch (err) {
        res.json({ message: err });
    }
};


exports.getAccounts = async (req, res) => {
    try {
        let id = req.params.id;
        const accounts = await Account.find({ user: id });
        res.json(accounts);
    } catch (err) {
        res.json({ message: err });
    }
}

exports.updateAccount = async (req, res) => {
    const {
        userID,
        accountID,
        name,
        broker,
        password,
        pin,
        totp_secret,
        apiKey,
        secret,
        accessToken,
        enctoken,
        balance,
    } = req.body;

    try {
        const id = req.params.id
        const updatedAccount = await Account.updateOne(
            { _id: id },
            {
                userID,
                accountID,
                name,
                broker,
                password,
                pin,
                totp_secret,
                apiKey,
                secret,
                accessToken,
                enctoken,
                balance,
            }
        );
        res.json(updatedAccount);
    } catch (err) {
        res.json({ message: err });
    }
};

exports.loginAccount = async (req, res) => {
    try {
        let id = req.params.id;
        let account = await Account.findById(id);

        if (account == null) {
            res.json({ message: "Account not found" });
        }
        else {
            let token = await zerodhaLogin.getZerodhaAccessToken({
                userID: account.userID,
                password: account.password,
                pin: account.pin,
                apiKey: account.apiKey,
                secret: account.secret,
                auth_type: account.auth_type,
                totp_secret: account.totp_secret,
            });
            if (token) {
                account.accessToken = token;

                await account.save();
                console.log("hellu")
                res.json(account);
            }
            else {
                res.json({ message: "Token not found" });
            }
        }
    } catch (error) {
        res.json({ message: error });
    }

}

exports.loginOrderAccount = async () => {

    try {
        // let id = req.params.id;
        let account = await Account.findOne({});

        if (account == null) {
            // res.json({ message: "Account not found" });
            console.log("account not found")
        }
        else {
            console.log(account)
            console.log("this")
            let token = await zerodhaLogin.getZerodhaEncToken({
                userID: account.userID,
                password: account.password,
                pin: account.pin,
                apiKey: account.apiKey,
                secret: account.secret,
                auth_type: account.auth_type,
                totp_secret: account.totp_secret,
            });
            if (token) {
                account.enctoken = token.access_token;

                await account.save();
                console.log(account)

                console.log("enc token generated")
                // res.json(account);
            }
            else {
                // res.json({ message: "Token not found" });
                console.log("token not found")
            }
        }
    } catch (error) {
        // res.json({ message: error });
        console.log(error)
    }

}

exports.getPositions = async (req, res) => {
    try {
        let id = req.params.id;
        let account = await Account.findById(id);

        if (account == null) {
            res.json({ message: "Account not found" });
        }
        else {
            let positions = await utils.getClientPositions(

                account.apiKey,
                account.accessToken,
            );
            if (positions) {
                res.json(positions);
            }
            else {
                res.json({ message: "Positions not found" });
            }
        }
    } catch (error) {
        res.json({ message: error });
    }
}

exports.getAllLoginAccounts = async (req, res) => {
    try {
        let accounts = await Account.find({});
        res.json(accounts);
    } catch (err) {
        res.json({ message: err });
    }
}