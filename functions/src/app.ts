import * as express from "express"
// create and setup express app
const app = express()
app.use(express.json())
let cors = require("cors");
require('dotenv').config()
const functions = require("firebase-functions");
const clientHost = process.env.CLIENT_HOST;

const corsConf = {
  origin: clientHost
}

app.use(cors(corsConf));

const api = require('./routes/api/index');

app.use('/v1', api);

app.use(express.static(__dirname + '/assets'));

exports.tasks = functions.https.onRequest(app);