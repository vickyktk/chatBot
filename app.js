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
const Routes=require('./Routes/Routes')
const APIRoutes=require('./Routes/APIRoutes')
let mongoUser=require('./Model/user')
let chat=require('./Model/chat');
const  Mongoose  = require('mongoose');
let mongoStore=require('connect-mongo')(session)

const cors = require('cors')

app.use(cors())


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
    saveUninitialized:false,
    store:new mongoStore({mongooseConnection:Mongoose.connection})
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

app.use('/',Routes)
app.use('/api',APIRoutes)


io.on('connection',socket=>{
    let users={}
    
    //When new user Login
    socket.on('user', async(data)=>{
        console.log(`${data.username} Joind the chat`)

                
        //Udating his staius to 1 online in mongoDB
        mongoUser.updateOne({email:`${data.email}`},{$set:{status:1}},(err,user)=>{
            if(err) throw err
        })


        const db_users = await mongoUser.find({email: {$ne: data.email}}).sort({status:-1})
        socket.emit('welcome',{"Friends":db_users})
        users[socket.id]=data.username;
        users['email']=data.email
    })


    //Start chat with a specific user
    socket.on('startChat',(info)=>{

        let reverse=[info[1],info[0]]

        let completeData={
            users:info,
            chatting:''
        }

        //Checking if they have any chat data saved
        chat.find({$or:[{users:info},{users:reverse}]},(err,res)=>{
            if(err) throw err;
            if(res.length > 0){
                //Yes they have chat data
                let room=res[0]._id;

                socket.join(room)

                let savedChat=res[0].chat
                //Sending chat history
                socket.emit('savedChat',savedChat)

                //SomeOne is typing


                socket.on('typing',(user)=>{
                    socket.broadcast.to(room).emit('notifyTyping',user)
                })

                        


                //Recieving the msg             
                socket.on('newMsg',(comingdata)=>{
                    data={
                        msg:comingdata.msg,
                        from:comingdata.user,
                        time:Date.now()

                    }


                                    
                chat.updateOne({$or:[{users:info},{users:reverse}]},{
                    //Saving the chat to mongodb
                            $push:{
                                chat:data
                            }
                        },(err,res)=>{
                            if(err) throw err;

                            //Emitting the mesage to the client the msg
                            io.to(room).emit('newMsg',data)
                        })

                })
            }else{

                let newData=new chat(completeData);
                newData.save((err,cb)=>{
                    if(err) throw err;
                    let room=cb._id

                    

                socket.join(room)

                //Recieving the msg             
                socket.on('newMsg',(comingdata)=>{
                   data={
                       msg:comingdata.msg,
                       from:comingdata.user,
                       time:Date.now()
                   }

                   
               //SomeOne is typing


               socket.on('typing',(user)=>{
                   socket.broadcast.to(room).emit('notifyTyping',user)
               })

               


                                   
               chat.updateOne({$or:[{users:info},{users:reverse}]},{
                   //Saving the chat to mongodb
                           $push:{
                               chat:data
                           }
                       },(err,res)=>{
                           if(err) throw err;

                           //Emitting the mesage to the client the msg
                           io.to(room).emit('newMsg',data)
                       })

               })
                })
            }
            
        })        
    })


    
    //When the user disconnects
    socket.on('disconnect',()=>{
        console.log(`${users[socket.id]} left the chat`)
        // socket.broadcast.emit('userLeft',`${users[socket.id]} has left the chat`)

        mongoUser.updateOne({email:`${users.email}`},{$set:{status:0}},(err,user)=>{
            if(err) throw err
        })
    })
})



let port= process.env.PORT || 5000

server.listen(port,()=>{
    console.log('Server started')
})
