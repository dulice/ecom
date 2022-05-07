import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import User from '../models/user.js'
import { generateToken, isAuth } from '../utils.js';

const router = express.Router();

router.post('/signin', expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if(user) {
        if(bcrypt.compareSync( req.body.password, user.password)) {
            res.send({
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            })
            return;
        }
    }
    res.status(404).send({message: 'Invalid Password or Email'})
}))

router.post('/signup', expressAsyncHandler(async( req, res ) => {
    const salt = await bcrypt.genSaltSync(10);
    const newUser = await new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt)
    });
    const user = await newUser.save();
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user)
    })
}))

router.put('/profile', isAuth , expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email
        if(req.body.password) {
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(req.body.password, salt)
        }
        const updateUser = await user.save();
        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
            token: generateToken(updateUser)
        })
    } else {
        res.status(400).json({message: 'User not found'});
    }
}))

export default router;