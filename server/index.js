const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require('dotenv');
const userRoute = require("./Routes/userRoute");
const qHRoute = require('./Routes/quoteHistoryRoute');
const profileRoute = require('./Routes/profileRoute');
const priceModuleRoute = require('./Routes/priceModuleRoute');

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const Port = process.env.PORT;
const connect = async () => {
    try {
        mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
        });
        console.log('connected to DB')
    }catch (err) {
        throw err;
    }
}

// Routes
app.use('/users', userRoute);
app.use('/quoteHistory', qHRoute);
app.use('/profile', profileRoute);
app.use('/prices', priceModuleRoute);


// middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})


// Check if backend + database is running
app.listen(Port, () => {
    console.log("server is running on", Port);
    connect();
})
