const express=require('express');
const app=express();
const http=require('http')
var server=http.createServer(app)
var io=require('socket.io')(server)


app.set('view engine','ejs')

app.use('/style',express.static('style'))
app.get('/',(req,res)=>{
    res.render('form')
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

