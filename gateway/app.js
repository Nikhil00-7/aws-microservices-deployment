const express = require('express')
const client = require('prom-client');
const expressProxy = require('express-http-proxy')

const app = express()

app.use('/user', expressProxy('http://user-service:3001'));
app.use('/captain', expressProxy('http://captain-service:3002'));
app.use('/ride', expressProxy('http://ride-service:3003'));

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

app.get("/health" ,(req , res)=>{
    return res.status(200).json({message:"healthy"})
})

app.listen(3000, () => {
    console.log('Gateway server listening on port 3000')
})