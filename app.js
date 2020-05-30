const express=require('express');
const app=express();
const http=require('http')
var server=http.createServer(app)
var io=require('socket.io')(server)
const bodyparser = require('body-parser')
const flash=require('express-flash')
const session=require('express-session')
const passport = require('passport')
const expressValidator = require('express-validator')
const expressLayouts=require('express-ejs-layouts')


//MiddleWare for Template engine EJS
app.set('view engine','ejs')

//MiddleWare for Epress-layouts
app.use(expressLayouts)


app.use('/style',express.static('style'))
app.get('/Login',(req,res)=>{
    res.render('Login')
})

app.get('/register',(req,res)=>{
    res.render('Register')
})

app.get('/index',(req,res)=>{
    res.render('index')
})


io.on('connection',socket=>{
    var users={};
    
    socket.on('user',(data)=>{
        console.log(`${data} has joined`)
        socket.broadcast.emit('newUser',data)
        socket.emit('welcome',data)
        users[socket.id]=data;

    })


    //Recieving the msg

    socket.on('newMsg',(info)=>{


        io.emit('newMsg',info)
        
    })



    //When the user disconnects
    socket.on('disconnect',()=>{
        console.log(`${users[socket.id]} left the chat`)
        socket.broadcast.emit('userLeft',`${users[socket.id]} has left the chat`)
    })

})

let port=process.env.PORT || 3000

server.listen(port,()=>{
    console.log('Server started')
})

