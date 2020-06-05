let mongoose=require('mongoose')
let keys=require('../config/keys')

mongoose.connect(keys.mongo.url,({
    useNewUrlParser:true,
    useUnifiedTopology:true
})),(err)=>{
    if (err) throw err
    console.log('Mogno DB Connected')
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

