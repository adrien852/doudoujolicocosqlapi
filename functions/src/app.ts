import * as express from "express"
// create and setup express app
const app = express()
app.use(express.json())
let cors = require("cors");
require('dotenv').config()
const {onRequest} = require("firebase-functions/v2/https");
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

exports.apiv2 = onRequest(app);