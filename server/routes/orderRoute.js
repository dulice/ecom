import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/user.js';
import Product from '../models/product.js';
import { isAdmin, isAuth } from '../utils.js';

const router = express.Router();

router.get('/', isAuth, isAdmin, expressAsyncHandler( async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.status(200).json(orders);
}))

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

router.get('/summary', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([{
        $group: {
            _id: null,
            numOrders: { $sum: 1},
            totalSales: { $sum: '$totalPrice'}
        }
    }]);

    const users = await User.aggregate([{
        $group: {
            _id: null,
            numUsers: { $sum: 1 }
        }
    }]);

    const dailyOrders = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: {format: '%Y-%m-%d', date: '$createdAt'}},
                orders: {$sum: 1},
                sales: { $sum: '$totalPrice'}
            }
        },
        { $sort: { _id: 1 }}
    ])

    const productCategories = await Product.aggregate([{
        $group: {
            _id: '$category',
            count: { $sum: 1}
        }
    }])

    res.status(200).json({
        orders,
        users,
        dailyOrders,
        productCategories
    })
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

router.delete('/:id', isAuth, isAdmin, expressAsyncHandler ( async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Delete Successfully!"})
    } else {
        res.status(404).json({message: "Order not found!"});
    }
}))

router.put('/:id/deliver', isAuth, isAdmin, expressAsyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        order.isDelivered = true;
        order.deliverAt = Date.now();
        await order.save();
        res.status(200).json({message: "Order Delivered"});
    } else {
        res.status(400).json({message: "Order not Found!"});
    }
}))


export default router;