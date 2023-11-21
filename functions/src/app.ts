import * as express from "express"
import { myDataSource } from "./myDataSource";
// create and setup express app
const app = express()
app.use(express.json())
let cors = require("cors");
require('dotenv').config()
const functions = require("firebase-functions");
const clientHost = process.env.CLIENT_HOST;

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

exports.tasks = functions.https.onRequest(app);