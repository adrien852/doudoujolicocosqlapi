"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// create and setup express app
var app = express();
app.use(express.json());
var api = require('./routes/api/index');
app.use('/v1', api);
app.listen(8080, function () {
    console.log('Server has started on port 3000');
});
