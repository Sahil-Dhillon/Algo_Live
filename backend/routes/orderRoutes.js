const express = require("express");
const router = express.Router();
const {
  getAllOrders,
} = require("../controllers/orderController");
const {
  requireSignin,
  authMiddleware,
} = require("../controllers/authControllers");

router.get("/getAllTrades/:id", requireSignin, authMiddleware, getAllOrders);

module.exports = router;
