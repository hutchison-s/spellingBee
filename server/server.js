const express = require('express');
const mongoose = require('mongoose');
const WordRouter = require('./routers/Router')
require('dotenv').config();

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

mongoose
    .connect(uri, {useNewUrlParser: true}).catch(console.log)
    .then(()=>{
        const app = express();
        app.use('/', WordRouter);
        app.listen(port, () => {
            console.log("Server listening on port", port)
        });
    })
