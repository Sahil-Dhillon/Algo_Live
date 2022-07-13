const Order = require("../models/orders");

exports.getAllOrders = async(req, res) => {
    try {
        const id = req.params.id;
        const orders = await Order.find({user: id});
        return res.json(orders);
    } catch (err) {
        return res.status(400).json({
            error: err,
        });
    }
}
