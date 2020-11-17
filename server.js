const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(
    process.env.ATLAS_URI,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    },
    err=> {
        if(err){
            console.log(err)
        }else{
            console.log("connected to database...")
        }
    }
);

// CORS
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// add routes
app.get('/', (req, res, next)=>{
    res.status(200).json({
        message:"welcome to passwordSafe API"
    })
})

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const dataRoutes = require('./routes/data');
app.use('/data', dataRoutes);

app.listen(3000||process.env.PORT, ()=>{
    console.log("Listening to port " + 3000||process.env.PORT)
});

