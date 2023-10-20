import * as express from "express"
// create and setup express app
const app = express()
app.use(express.json())

const api = require('./routes/api/index');

app.use('/v1', api);

app.listen(8080, function () {
    console.log('Server has started on port 8080');
  });