const mongoose = require('mongoose');
require('mongoose-type-email')

const User = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('user', User);