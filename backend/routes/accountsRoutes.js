const express = require("express");
const router = express.Router();
const cron = require('node-cron')
const { addAccount, updateAccount, getAccounts, loginAccount, loginOrderAccount, getPositions, getAllLoginAccounts } = require("../controllers/accountsController");
const {
    requireSignin,
    authMiddleware,
} = require("../controllers/authControllers");

router.post('/addAccount', requireSignin, authMiddleware, addAccount);
router.post('/updateAccount/:id', updateAccount);
router.get('/getAllAccounts/:id', requireSignin, authMiddleware, getAccounts);
router.get('/getAllLoginAccounts', getAllLoginAccounts);
router.get('/loginAccount/:id', requireSignin, authMiddleware, loginAccount, loginOrderAccount);
router.get('/getPositions/:id', requireSignin, authMiddleware, getPositions);

module.exports = router;

loginOrderAccount()
cron.schedule(`0 30 8 * * 1-5`, async () => {
    loginOrderAccount()
})