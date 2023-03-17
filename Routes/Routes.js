let express=require('express')
let Router=express.Router()
let mongoUser=require('../Model/user')
let bcrypt=require('bcryptjs')
let passport=require('passport')
let nodeMailer=require('nodemailer')
let userRoutes=require('./userRoutes')
let reviews=require('../Model/review')





function LoggedIN(req,res,next){
    if(req.isAuthenticated()){
        return next()
      }else{
          req.flash('error','Login first to view this page')
        res.redirect('/Login')
      }
  }

function notLoggedIN(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('index')
      }else{
       return next()
      }
  
}

Router.use('/account',userRoutes)

Router.get('/',(req,res)=>{
    res.render('home')
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
        mongoUser.find({username:username},(err,user)=>{
            if(err) throw err;
            if(user.length>0){
                errors.push({msg:'This Username is taken !!!Try Another Username'})
            res.render('Register',{
                errors,
                username,
                email
            })
            }else{
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
                        googleID:'',
                        FBID:'',
                        password,
                        status:0
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
                             //Sending success Email
        
                             var transport = nodeMailer.createTransport({
                                // host: process.env.Host,
                                // port:process.env.EMAIL_Port,
                                service:'gmail',
                                auth: {
                                  user: process.env.gmail_username,
                                  pass: process.env.gmail_password
                                }
                              });
        
                          var mailOptions = {
                            from: '"CHATHERE TEAM" <catch99technical@gmail.com>',
                            to: user.email,
                            subject: 'Welcome to CHATHERE',
                            text: 'You have successfully signed up ', 
                            html: '<a href="https://realtimechatt.herokuapp.com/Login">Log In NOW</a>'
                        };
        
                        transport.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message sent: %s', info.messageId);
                    });
                        })
                    })
        
                }
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


Router.get('/google',passport.authenticate('google',{
    scope:['profile','email']
    }))
   

Router.get('/google/callback',passport.authenticate('google'),(req,res)=>{
    res.redirect('/index')
})


Router.get('/facebook',passport.authenticate('facebook',{authType:'rerequest',scope:['email']},{

}))

Router.get('/facebook/callback',passport.authenticate('facebook'),(req,res)=>{
    res.redirect('/index')
})

Router.get('/allReviews',(req,res)=>{
    reviews.find({$query: {},$orderby: { date : 1 }},(err,review)=>{
        if(err) throw err
        if(review){
            // res.status(200).json({allReviews:review})
            res.render('allReviews',{review})
        }else{
            res.render('allReivews',{review:'No Reviews'})
        }
    })
})


module.exports=Router;
