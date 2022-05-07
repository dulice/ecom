import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';

const router = express.Router();

router.post('/', isAuth, expressAsyncHandler( async (req, res) => {
    const newOrder = new Order({
        orderItems: req.body.orderItems.map(item => ({...item, product: item._id})),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id
    })
    const order = await newOrder.save();
    res.status(200).json({message: 'New OrderCreatde', order});
}))

router.get('/mine', isAuth, expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id});
    res.send(orders);
}))

router.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        res.status(200).json(order);
    } else {
        res.status(400).json({message: 'Order not found.'})
    }
}))


export default router;