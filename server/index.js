import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productRoute from './routes/singleProduct.js'
import productSeedRoute from './routes/productSeed.js'
import userRoute from './routes/userRoute.js'
import orderRoute from './routes/orderRoute.js'

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

mongoose.connect(process.env.CONNECT_DB)
    .then(() => {
        app.listen(5000);
        console.log('connect to db');
    })
    .catch(err => {
        console.log(err.message);
    });

app.use('/api/seed', productSeedRoute) 
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);

app.use((err, req, res, next) => {
    res.status(500).json({message: err.message});
})
