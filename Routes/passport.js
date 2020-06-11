let LocalStrategy = require('passport-local').Strategy

let GoogleStrategy = require('passport-google-oauth20').Strategy
let FbStrategy=require('passport-facebook').Strategy
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


passport.use('google' ,new GoogleStrategy({
    clientID:'198592292960-ujhmjkvkkgfupe5ouaqtflnke6hii0qj.apps.googleusercontent.com',
    clientSecret:'-MMn1Z6iMqM9E-_aVr21JjxF',
    callbackURL:'http://localhost:3000/google/callback',
    callbackURL:'https://realtimechatt.herokuapp.com/google/callback'
},(accessToken,refreshToken,profile,cb)=>{
    let username=profile.displayName
    let email=profile._json.email
    let googleID=profile.id
    let FBID=''
    let password='dfnjknfksf@fsfj-34'

    mongoUser.find({email:email},(err,user)=>{
        if(err) throw err
        if(user.length>0){
            cb(null,user[0])
        }else{
            let user=new mongoUser({username,email,googleID,FBID,password})

            user.save((err,user)=>{
                if(err) throw err
                cb(null,user)
            })
        }
    })

}) )







passport.use('facebook',new FbStrategy({
    clientID:'168818324261752',
    clientSecret: 'ede814d74e651b06050c5bd49d8f7df3',
    callbackURL: "http://localhost:3000/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, cb)=>{
        var username=profile._json.name;
        var email=profile._json.email;
        var googleID='';
        var FBID=profile._json.id
        var password='ffvmkfvmke"@-43352dfsffd'
    
        
    mongoUser.find({FBID:FBID},(err,user)=>{
        if(user.length>0){
            console.log('old user fb')
            cb(null,user[0]);
        }else{
            
    var newUser=new mongoUser({username,email,googleID,FBID,password})
    
    newUser.save((err,user)=>{
        if(err) throw err;
        console.log('new user fb')
        cb(null,user);
    
    })
    
        }
    })
        
    }
    ))