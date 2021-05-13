const express = require('express');
const app = express();
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')



mongoose.connect(MONGOURI,{
    useNewUrlParser:true, useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
    console.log("Data base online")
})

mongoose.connection.on('error',(err)=>{
    console.log("err conectint", err)
})
//cors configured forward request to server adress
/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});*/



require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/users'))

// if the aplication is deployed
if(process.env.NODE_ENV=="production"){
    //if client is making any request, we will send the html file on the build folder
    //so the react code can handle the requests
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(_dirname,'client','build','index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log('server is running on', PORT)
})

/*const customMiddleware = (req,res,next)=>{
    console.log('middleware executed')
    //if next is not called, middleware wil leave the server hanging
    next()
}

//app.use(customMiddleware) .use = apply to all routes


app.get('/',(req,res)=>{
    console.log('Home')
    res.send('hello world')
})
//i can put a middleware into a specific rout like this:
app.get('/about', customMiddleware,(req,res)=>{
    console.log('About')
    res.send('About Page')
})
*/
