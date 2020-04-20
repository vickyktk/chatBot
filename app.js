const express=require('express');
const app=express();
const http=require('http')
var server=http.createServer(app)
var io=require('socket.io')(server)


app.use('/style',express.static('style'))
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/form.html')
})

app.get('/index',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
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



server.listen(3000,()=>{
    console.log('Server started')
})

