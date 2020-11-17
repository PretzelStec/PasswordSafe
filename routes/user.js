const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const router = express.Router();

const User = require('../model/User');
const catchError = require('../utils/catch');


//register user
router.post("/register", (req, res, next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            res.status(400).json({
                status : "failed",
                message : "Invalid Email"
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash)=> {
                if(err){
                    res.status(400).json({
                        status:"failed",
                        error:err
                    })
                }else{
                    const newUser = new User({
                        _id: mongoose.Types.ObjectId(),
                        email:req.body.email,
                        password:hash
                    })
                    newUser
                    .save()
                    .then(user => {
                        res.status(201).json({
                            status:"success",
                            message:"user successfully created"
                        })
                    })
                    .catch(catchError);
                }
            })
        }
    })
    .catch(catchError);
})


//login to account
router.post('/login', (req, res, next) => {
    User.findOne({email:req.body.email})
    .exec()
    .then(user => {
        if(user){
            bcrypt.compare(req.body.password, user.password, (err, isSame) => {
                if (err){
                    catchError(err);
                }else if(!isSame){
                    res.status(409).json({
                        status:"failed",
                        message:"Password and Email does not match"
                    })
                }else{
                    const token = jwt.sign({
                        userID:user._id
                    }, process.env.SECRET_KEY);
                    res.status(200).json({
                        status:'success',
                        token:token
                    })
                }
            })
        }else{
            res.status(404).json({
                status:"failed",
                message:"Password and Email does not match"
            })
        }
    })
    .catch(catchError);
})

module.exports = router;