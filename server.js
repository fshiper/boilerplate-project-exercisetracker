const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const api = require('./api');

app.set("port", process.env.PORT || 8081);
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api', api);

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: `Path ${req.path} not found.`})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to MongoDB");

  app.listen(app.get("port"), function() {
    console.log("API Server Listening on port " + app.get("port") + "!");
  });
});
