let express=require('express')
let expressValidator=require('express-validator')
let bodyParser=require('body-parser')
let Router=express.Router()
let mongoUser=require('../Model/user')
let bcrypt=require('bcryptjs')
let flash=require('express-flash')
let passport=require('passport')




function LoggedIN(req,res,next){
    if(req.isAuthenticated()){
        return next()
      }else{
        res.redirect('Login')
      }
  }

function notLoggedIN(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('index')
      }else{
       return next()
      }
  
}



Router.get('/',notLoggedIN,(req,res)=>{
    res.render('Login')
})



Router.get('/Register',notLoggedIN,(req,res)=>{
    res.render('Register')
})


Router.post('/Register',(req,res)=>{

    //Validating the inputs
    let username=req.body.username
    let email=req.body.email
    let password=req.body.password

    req.checkBody('username','Username Must be 5 characters Long').notEmpty().escape().isLength({min:5,max:15})
    req.checkBody('email','enter a valid Email Address').notEmpty().isEmail()
    req.checkBody('password','Password must be at least 6 charcters long').notEmpty().isLength({min:6})

    let errors=req.validationErrors()

    if(errors.length){

        res.render('Register',{
            errors,
            username,
            email
        })
    }else{
        let errors=[]
        //Checking if user already exist
        
        mongoUser.find({email:email},(err,user)=>{
            if(err) throw err;
        if(user.length>0) {
            errors.push({msg:'Email Already Exist !!!Try Another Email Address'})
            res.render('Register',{
                errors,
                username,
                email
            })
        }else{
            let user={
                username,
                email,
                password
            }
            //hashing the password
            bcrypt.hash(user.password,10,(err,hashedPass)=>{
                if(err) throw err
                user.password=hashedPass
                
                //sAVING THE uSER TO db
                let newUser=new mongoUser(user)
                newUser.save((err,user)=>{
                    if(err) throw err
                    console.log(user)
                    req.flash('success_msg','Successfully Signed UP !!! Login Now')
                    res.redirect('/Login')
                })
            })

        }
        })
    }
})




Router.get('/Login',notLoggedIN,(req,res)=>{
    res.render('Login')
})


Router.post('/Login',passport.authenticate('local',{
    successRedirect:'/index',
    failureRedirect:'/Login',
    failureFlash:true,
    successFlash:true
}),(req,res,next)=>{
})



Router.get('/index',LoggedIN,(req,res)=>{
    res.render('index',{user:req.user})
})


Router.get('/logout',(req,res)=>{
    req.logout()
    req.flash('success_msg','You are logged out')
  res.redirect('Login')
})

module.exports=Router;