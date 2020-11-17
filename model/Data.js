const mongoose = require('mongoose');
require('mongoose-type-email')

const Data = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    website:{
        required:true,
        type:String
    },
    username:{
        required:false,
        type:String,
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    notes:{
        required:false,
        type:String
    },
    dateAdded:{
        type: Date,
        default: Date.now
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    }
})

module.exports = mongoose.model('data', Data);