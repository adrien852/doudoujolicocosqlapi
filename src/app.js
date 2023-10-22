"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// create and setup express app
var app = express();
app.use(express.json());
var cors = require("cors");
require('dotenv').config();
var clientHost = process.env.CLIENT_HOST;
var corsConf = {
    origin: clientHost
};
app.use(cors(corsConf));
var api = require('./routes/api/index');
app.use('/v1', api);
app.listen(8080, function () {
    console.log('Server has started on port 8080');
});
