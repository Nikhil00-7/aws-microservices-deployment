const express = require('express')
const expressProxy = require('express-http-proxy')

const app = express()

app.use('/user', expressProxy('http://user-service:3001'));
app.use('/captain', expressProxy('http://captain-service:3002'));
app.use('/ride', expressProxy('http://ride-service:3003'));

app.get("/health" ,(req , res)=>{
    return res.status(200).json({message:"healthy"})
})

app.listen(3000, () => {
    console.log('Gateway server listening on port 3000')
})