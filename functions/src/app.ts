import * as express from "express"
import { myDataSource } from "./myDataSource";
// create and setup express app
const app = express()
app.use(express.json())
let cors = require("cors");
require('dotenv').config()
const functions = require("firebase-functions");
const clientHost = process.env.CLIENT_HOST;
var http = require('http');

const corsConf = {
  origin: clientHost,
  credentials: true,
}

app.use(cors(corsConf));

const api = require('./routes/api/index');

app.use('/v1', api);

app.use(express.static(__dirname + '/assets'));

myDataSource.initialize()
.then(async () => {
  
  console.log("Data Source has been initialized!");
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Server running on port 8080');
});

