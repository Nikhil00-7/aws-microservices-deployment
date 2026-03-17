const dotenv = require('dotenv')
dotenv.config()
const client = require('prom-client');
const express = require('express')
const app = express()
const connect = require('./db/db')
connect()
const captainRoutes = require('./routes/captain.routes')
const cookieParser = require('cookie-parser')
const rabbitMq = require('./service/rabbit')

rabbitMq.connect()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/health" ,(req , res)=>{
   return res.status(200).json({message: "OK"})
})

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ 
  prefix: 'myapp_', 
  timeout: 5000   
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).end();
  }
});

app.use('/', captainRoutes)

module.exports = app