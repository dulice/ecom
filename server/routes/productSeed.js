import express from 'express'

import Product from '../models/product.js';
import User from '../models/user.js';
import data from '../data.js';

const router = express.Router();

router.get('/', async (req, res) => {
    await Product.deleteMany({});
    const createProduct = await Product.insertMany(data.products);

    await User.deleteMany({}); 
    const createUser = await User.insertMany(data.users);
    res.send({createProduct, createUser});
})

export default router;