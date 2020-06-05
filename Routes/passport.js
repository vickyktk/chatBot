let LocalStrategy = require('passport-local').Strategy
let passport=require('passport')
let mongoUser=require('../Model/user')
let bcrypt=require('bcryptjs')

passport.serializeUser((user,done)=>{
    done(null,user._id)
})

passport.deserializeUser((id,done)=>{
    mongoUser.find({_id:id},(err,user)=>{
        if(err) throw err
        done(err,user)
    })
})

passport.use(new LocalStrategy({usernameField:'Email'},(Email,password,cb)=>{
    mongoUser.find({email:Email},(err,user)=>{
        if(err) throw err
        if(user.length==0){
            //If no User found
            cb(null,false,{message:'incorrect Login Information'})
        }else{
            bcrypt.compare(password,user[0].password,(err,resultData)=>{
                if(err) throw err
                if(resultData==true){
                    cb(null,user[0],{message:'Successfully Loged IN'})
                }else{
                    cb(null,false,{message:'incorrect Login Information'})
                }
            })
        }
    })
}))