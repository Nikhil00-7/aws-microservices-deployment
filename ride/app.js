const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connect = require('./db/db');
connect();
const cookieParser = require('cookie-parser');
const rideRoutes = require('./routes/ride.routes');
const rabbitMq = require('./service/rabbit')
const client = require("prom-client");

rabbitMq.connect();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health" ,(req , res)=>{
   return res.status(200).json({message: "OK"})
})

// Create a counter metric
const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "statusCode"]
});

// Expose metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});


app.get("/", (req, res) => {
  requestCounter.labels(req.method, req.route.path, 200).inc();
  res.send("Hello World");
});

app.use('/', rideRoutes);


module.exports = app;