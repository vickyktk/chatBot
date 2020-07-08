let mongoose=require('mongoose')
require('dotenv').config()
let url=process.env.mongoAtlas
// let url=process.env.mongoLocal

mongoose.connect(url,({
    useNewUrlParser:true,
    useUnifiedTopology:true
}))


let schema=new mongoose.Schema({
    byUser:{
        type:String,
        required:true
    },
    review:{
        type:String,
        required:true
    },
    ratings:{
        type:Number,
        required:true
    },
    adminReply:{
        type:String
    }
    
})

let userReviews=new mongoose.model('reviews',schema);
module.exports=userReviews