import { Router } from "express";

import Product from "../models/product.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }catch(err) {
        res.status(500).json({message: err.message});
    }
})

router.get('/slug/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({slug: req.params.slug});
        if(product) {
            res.json(product);
        } else {
            res.status(404).json('Product Not found');
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
})

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product) {
            res.json(product);
        } else {
            res.status(404).json('Product Not found');
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

export default router;