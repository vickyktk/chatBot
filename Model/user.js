let mongoose=require('mongoose')
// let url='mongodb+srv://waqasKhattak:database85@testcluster-ezzzf.mongodb.net/test?retryWrites=true&w=majority'
let url='mongodb://127.0.0.1:27017/newDB'
// let keys=require('.././config/keys')

mongoose.connect(url,({
    useNewUrlParser:true,
    useUnifiedTopology:true
})),(err)=>{
    if (err) throw err
    console.log('Mongo DB Connected')
}
let schema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    googleID:{
        type:String,
        require:true
    },
    FBID:{
        type:String,
        require:true
    },
    password:{
        type:String,
        required:true
    }
})


let user=mongoose.model('user',schema)

module.exports=user





// user.find({_id:'5ed8d5052240ee1f94c4a921'},(err,user)=>{
//     if(err) throw err
//     console.log(user)
// })

