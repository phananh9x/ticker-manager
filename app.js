var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var dbConfig = require('./config/dbconfig');
var userRouter = require('./routes/User.routes');
var cors = require('./middleware/cors');
var errorHandler = require('./middleware/error-handler');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors.cors());
app.use('/bank', userRouter());
app.use(errorHandler.errorHandler());

app.listen(8080, function() {
    console.log('Server start at port 8080');
});