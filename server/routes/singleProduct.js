import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import Product from "../models/product.js";
import { isAdmin, isAuth } from "../utils.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }catch(err) {
        res.status(500).json({message: err.message});
    }
})

router.post('/', isAuth, isAdmin, expressAsyncHandler( async (req, res) => {
    const product = await new Product({
        name: 'sample name ' + Date.now(),
        slug: 'sample-name-' + Date.now(),
        image: '/images/p1.jpg',
        price: 0,
        category: 'sample category',
        brand: 'sample brand',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: 'sample description',
    })
    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
}))

router.get('/admin', isAuth, isAdmin, expressAsyncHandler( async ( req, res ) => {
    const PAGE_SIZE = 30;
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);

    const countProducts = await Product.countDocuments();

    res.status(200).json({
        products,
        countProducts,
        page,
        pages: Math.ceil( countProducts / pageSize )
    })
}))

router.get('/search', expressAsyncHandler(async (req, res) => {
    const PAGE_SIZE = 3;
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const rating = query.rating || '';
    const price = query.price || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter = searchQuery && searchQuery !== 'all'
        ? {
            name: {
                $regex: searchQuery,
                $options: 'i'
            }
        } 
        : {};

    const categoryFilter = category && category !== 'all'
        ? { category } : {};

    const ratingFilter = rating && rating !== 'all'
        ? {
            rating: {
                $gte: Number(rating)
            }
        }
        : {};

    const priceFilter = price && price !== 'all'
        ? {
            price: {
                $gte: Number(price.split('-')[0]),
                $lte: Number(price.split('-')[1])
            }
        }
        : {} ;

    const sortOrder = 
        order === 'featured'
            ? { featured: -1 }
            : order === 'lowest'
            ? { price: 1}
            : order === 'highest'
            ? { price: -1}
            : order === 'toprated'
            ? { rating: -1}
            : order === 'newest'
            ? { createdAt: -1 }
            : { id: -1 };

    const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...ratingFilter,
        ...priceFilter,
    })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize)

    const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...ratingFilter,
        ...priceFilter
    })

    res.status(200).json({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize)
    })

}))

router.get('/categories', expressAsyncHandler( async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.status(200).json(categories);
}))

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

router.put('/:id', isAuth, isAdmin, expressAsyncHandler( async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product) {
        const updateProduct = await Product.findByIdAndUpdate(productId, {
            $set: req.body
        },{new: true});
        res.status(200).json(updateProduct);
    } else {
        res.status(400).json({message: "Can't update the product"});
    }
}));

router.delete('/:id', isAuth, isAdmin, expressAsyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product) {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Delete Product Successfully");
    } else {
        res.status(400).json({message: "Can't delete the product"});
    }
}))

export default router;