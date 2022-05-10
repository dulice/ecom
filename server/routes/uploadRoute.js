import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifer from 'streamifier';
import { isAdmin, isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const upload = multer();
const router = express.Router();

router.post('/', isAuth, isAdmin, upload.single('file'), expressAsyncHandler( async (req, res) => {
    cloudinary.config({
        cloud_name: process.env.CLOUCINARY_NAME,
        api_key: process.env.CLOUCINARY_API_KEY,
        api_secret: process.env.CLOUCINARY_API_SECRET
    });
    const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream((error, result) => {
                if(result) {
                    resolve(result);
                } else {
                    reject(error)
                }
            })
            streamifer.createReadStream(req.file.buffer).pipe(stream);
        })
    }
    const result = await streamUpload(req);
    res.status(200).json(result); 
}))

export default router;


