let LocalStrategy = require('passport-local').Strategy
let GoogleStrategy = require('passport-google-oauth20').Strategy
let FbStrategy=require('passport-facebook').Strategy
let passport=require('passport')
let mongoUser=require('../Model/user')
let bcrypt=require('bcryptjs')
let nodeMailer=require('nodemailer')

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
    clientID:process.env.gclientID,
    clientSecret:process.env.gclientSecret,
    callbackURL:'http://localhost:3000/google/callback',
    callbackURL:'https://realtimechatt.herokuapp.com/google/callback'
},(accessToken,refreshToken,profile,cb)=>{
    let username=profile.displayName
    let email=profile._json.email
    let googleID=profile.id
    let FBID=''
    let password='dfnjknfksf@fsfj-34'
    let status=0;

    mongoUser.find({email:email},(err,user)=>{
        if(err) throw err
        if(user.length>0){
            cb(null,user[0])
        }else{
            let user=new mongoUser({username,email,googleID,FBID,password,status})

            user.save((err,user)=>{
                if(err) throw err
                cb(null,user)

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
        }
    })

}) )







passport.use('facebook',new FbStrategy({
    clientID:process.env.FBclientID,
    clientSecret: process.env.FBclientSecret,
    callbackURL: "http://localhost:3000/facebook/callback",
    callbackURL:'https://realtimechatt.herokuapp.com/facebook/callback',

    profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, cb)=>{
        var username=profile._json.name;
        var email=profile._json.email;
        var googleID='';
        var FBID=profile._json.id
        var password='ffvmkfvmke"@-43352dfsffd'
        var status=0;

    
        
    mongoUser.find({FBID:FBID},(err,user)=>{
        if(user.length>0){
            console.log('old user fb')
            cb(null,user[0]);
        }else{
            
    var newUser=new mongoUser({username,email,googleID,FBID,password,status})
    
    newUser.save((err,user)=>{
        if(err) throw err;
        cb(null,user);

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
    
        }
    })
        
    }
    ))