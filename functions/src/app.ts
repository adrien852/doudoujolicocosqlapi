import * as express from "express"
// create and setup express app
const app = express()
app.use(express.json())
let cors = require("cors");
require('dotenv').config()
const functions = require("firebase-functions");
const clientHost = process.env.CLIENT_HOST;
const cookieParser = require("cookie-parser");

const corsConf = {
  origin: clientHost,
  credentials: true,
}

app.use(cors(corsConf));

app.use(cookieParser());

const api = require('./routes/api/index');

app.use('/api', api);

app.use(express.static(__dirname + '/assets'));

exports.api = functions.https.onRequest(app);