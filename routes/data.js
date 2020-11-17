const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const router = express.Router();

const Data = require('../model/Data');

//get utilities
const authenticator = require('../utils/authenticator');
const crypt = require('../utils/encryption');

router.get('/', authenticator, (req, res, next) => {
    Data.find({createdBy:req.user.userID})
    .exec()
    .then(data => {
        //console.log(data)
        unencryptedData = [];
        for(x of data){
            //console.log(crypt.decrypt({content:x.username.split('+')[0], iv:x.username.split('+')[1]}))
            unencryptedData.push({
                _id:x._id,
                username:crypt.decrypt({content:x.username.split('+')[0], iv:x.username.split('+')[1]}),
                website:crypt.decrypt({content:x.website.split('+')[0], iv:x.website.split('+')[1]}),
                email:crypt.decrypt({content:x.email.split('+')[0], iv:x.email.split('+')[1]}),
                password:crypt.decrypt({content:x.password.split('+')[0], iv:x.password.split('+')[1]}),
                notes:crypt.decrypt({content:x.notes.split('+')[0], iv:x.notes.split('+')[1]}),
                dateAdded:x.dateAdded
            })
        }
        res.status(200).json({
            status:"success",
            data:unencryptedData
        })
    })
    .catch(err => {
        return res.status(400).json({
            status: "failed",
            error:err
        })
    });
})

router.post('/', authenticator, (req, res, next) => {
    const encryptedData = new Data({
        _id: mongoose.Types.ObjectId(),
        username: crypt.encrypt(req.body.username).content,
        website: crypt.encrypt(req.body.website).content,
        email: crypt.encrypt(req.body.email).content,
        password: crypt.encrypt(req.body.password).content,
        notes: crypt.encrypt(req.body.notes).content,
        createdBy: req.user.userID
    })
    //console.log(encryptedData)
    encryptedData
    .save()
    .then(data => {
        res.status(201).json({
            status:"success",
            message:"successfully added data"
        })
    })
    .catch(err => {
        return res.status(400).json({
            status: "failed",
            error:err
        })
    })
})

router.delete('/:id', authenticator, (req, res, next) => {
    Data.findByIdAndDelete(req.params.id)
    .exec()
    .then(data => {
        res.status(200).json({
            status:"success",
            message:"successfully deleted data"
        })
    })
    .catch(err => {
        res.status(400).json({
            status:'failed',
            error:err
        })
    })
})

module.exports = router;