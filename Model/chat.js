let mongoose=require('mongoose')
require('dotenv').config()
let url=process.env.mongoAtlas
// let url=process.env.mongoLocal

mongoose.connect(url,({
    useNewUrlParser:true,
    useUnifiedTopology:true
}))

let schema2=mongoose.Schema({
    users:{
        type:Array
    },
    chat:{
        type:Array
    }
})

let chats=mongoose.model('chat',schema2)

module.exports=chats





//Testing

// chats.deleteMany({},(err,res)=>{
//     if(err) throw err,
//     console.log(res)
// })

// let users=['Shaihd','khattak']
// let reverse=users.reverse()
// let chattings={msg:'hye hello whats up',from:'shaid',time:Date.now()}

// let reverse=user.reverse()

// chats.updateOne({$or:[{users:users},{users:reverse}]},{
//             $set:{
//                 chat:chattings
//             }
//         },(err,res)=>{
//             if(err) throw err;
//             console.log(res)
//         })
// chats.find({},(err,res)=>{
//     // res.forEach((val,index,arr)=>{
//     //     console.log(val)
//     // })
//     console.log(res)
// })


// chats.find({users:['Waqas','khattak']},(err,res)=>{
//     console.log(res)
// })


// chats.find({},(err,res)=>{
//     console.log(res)
// })



//Finding if users already have chatHistory

// chats.find({$or:[{users:users},{users:reverse}]},(err,res)=>{
//     if(err) throw err;
//     chats.updateOne({$or:[{users:users},{users:reverse}]},{
//         $push:{
//             chat:chattings
//         }
//     })

// let info=
// {
//     users:reverse,
//     chat:chattings
// }

// let newFriends=new chats(info);

// newFriends.save((err,data)=>{
//     if(err) throw err;
//     console.log(data)

// })


// chats.deleteMany({},(err,res)=>{
//     if(err) throw err,
//     console.log(res)
// })

//             let name='boom boom'
//             chats.find({},(err,user)=>{
//                 if(err) throw err
//                 user.forEach((val,index,arr)=>{
//                     let ar=val.users
//                     if(ar.includes(name)){
//                         let  index=ar.indexOf(name)
//                         ar[index]='Shahid Afridi'
//                         // console.log(ar)
//                         // console.log(index)
//                         // console.log(val._id)



//                         chats.updateOne({_id:val._id},{$set:{users:ar}},(err,cd)=>{
//                             if(err) throw err;
//                             console.log(cd)
//                         })
//                     }
//                 })
//             })


// chats.find({},(e,c)=>{
//     console.log(c)
// })


// chats.find({users:{$in:['Virat Kohli33']}},(err,user)=>{
//     if(err) throw err
//     user.forEach((val)=>{
//         if(val.chat.length>0){

//             val.chat.forEach((obj)=>{
    
//                     let time=obj.time
//                     chats.find({chat:{$in:[time]}},(err,res)=>{
//                         if(err) throw err
//                         console.log(res)
//                     })
  
//               })

//         }

//     })
// })