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
const nodeMailer=require('nodemailer')
const Routes=require('./Routes/Routes')


require('dotenv').config()
require('./Routes/passport');


//MiddleWare for Template engine EJS
app.set('view engine','ejs')

//MiddleWare for Epress-layouts
app.use(expressLayouts)


app.use(flash())


app.use(session({
    secret:'yourAPp',
    resave:false,
    saveUninitialized:false
}))


app.get('*',(req,res,next)=>{
    res.locals.user=req.user || null
    next()
})

app.use((req,res,next)=>{
    res.locals.success_msg= req.flash('success_msg')
    res.locals.error_msg= req.flash('error_msg')

    res.locals.user=req.user || null;

    next()
})

app.use(bodyparser.urlencoded({extended:false}))


//Exp-validator middleware
app.use(expressValidator({
    errorFormatter:function(param,msg,value){
        var namespace=param.split('.'),
        root=namespace.shift(),
        formParam=root;
        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';

        }
        return {
            param : formParam,
            msg   : msg,
            value : value
          };
    }
}))

//Passport Middleware

app.use(passport.initialize())
app.use(passport.session())

app.use('/style',express.static('style'))
app.get('/',(req,res)=>{
    res.render('Login')
})
app.use('/',Routes)




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


    //SomeOne is typing


    socket.on('typing',(user)=>{
        socket.broadcast.emit('notifyTyping',user)
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

