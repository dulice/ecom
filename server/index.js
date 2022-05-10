import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import productRoute from './routes/singleProduct.js'
import productSeedRoute from './routes/productSeed.js'
import userRoute from './routes/userRoute.js'
import orderRoute from './routes/orderRoute.js'
import uploadRoute from './routes/uploadRoute.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
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

app.get('/api/keys/google', (req, res) => {
    res.send({key: process.env.GOOGLE_API_KEY || ''});
})

app.use('/api/upload', uploadRoute)
app.use('/api/seed', productSeedRoute) 
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

app.use((err, req, res, next) => {
    res.status(500).json({message: err.message});
})
