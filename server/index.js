const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

mongoose
    .connect(uri, {useNewUrlParser: true}).catch(console.log)
    .then(()=>{
        const app = express();
        const WordRouter = require('./routers/Router')
        app.get('/', function(req, res) {
            res.sendFile(path.join(__dirname, '/index.html'));
        });
        app.use('/api', WordRouter);
        app.get('/ping', (req, res) => {
            res.send("pong")
        })
        app.listen(port, () => {
            console.log("Server listening on port", port)
        });
    })
