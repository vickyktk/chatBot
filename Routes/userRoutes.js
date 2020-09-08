let express=require('express')
let mongoUser=require('../Model/user')
let chat=require('../Model/chat')
let router=express.Router()
let userReivews=require('../Model/review')






function LoggedIN(req,res,next){
    if(req.isAuthenticated()){
        return next()
      }else{
        req.flash('error','Login first to view this page')
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





router.get('/',LoggedIN,(req,res)=>{
    res.render('account',{user:req.user})
})


router.post('/',LoggedIN,(req,res)=>{

    //Validating the inputs
    let username=req.body.username
    let email=req.body.email
    let id=req.body.id
    let hiddenUsername=req.body.hiddenUsername

    req.checkBody('username','Username Must be 5 characters Long').notEmpty().escape().isLength({min:5,max:15})
    req.checkBody('email','enter a valid Email Address').notEmpty().isEmail()

    let errors=req.validationErrors()

    if(errors.length){

        res.render('account',{
            errors,
            username,
            email,
            user:req.user
        })
    }else{
        let errors=[]
        //Checking if user already exist
        mongoUser.find({username:username,_id:{$nin:[id]}},(err,user)=>{
            if(err) throw err;
            if(user.length>0){

                errors.push({msg:'This Username is taken !!!Try Another Username'})
            res.render('account',{
                errors,
                username,
                email,
                user:req.user
            })
            }else{
                mongoUser.find({email:email,_id:{$nin:[id]}},(err,user)=>{
                    if(err) throw err;
                if(user.length>0) {
                    errors.push({msg:'Email Already Exist !!!Try Another Email Address'})
                    res.render('account',{
                        errors,
                        username,
                        email,
                        user:req.user

                    })
                }
                else{
                    
   mongoUser.updateOne({_id:id},{$set:{username:username,email:email}},(err,cb)=>{
    if(err) throw err

                
        let name=hiddenUsername
        chat.find({users:{$in:[name]}},(err,user)=>{
            if(err) throw err
            user.forEach((val)=>{
                let ar=val.users

                    let  index=ar.indexOf(name)
                    ar[index]=username

                    chat.updateOne({_id:val._id},{$set:{users:ar}},(err,cd)=>{
                        if(err) throw err;
                        console.log('Updated chats')
                    })


            })
        })
    req.flash('success_msg','Successfully Updated your data')
    res.redirect('/account')
    })

                }
        })
 
    }

})
    }
    })



router.get('/review',LoggedIN,(req,res)=>{
    let currentUser=req.user[0].username
    userReivews.find({byUser:currentUser},(err,reviews)=>{
        if(err) throw err;
        if(reviews){
           res.render('review',{
               user:req.user,
            reviews})

        }else{
             res.render('review',{user:req.user})

        }
    })
})


router.post('/review',LoggedIN,(req,res)=>{
    let review=req.body.review;
    let rate=req.body.rate;
    req.checkBody('review','Please add a review').notEmpty()
    req.checkBody('rate','Please Consider rating us').notEmpty()
    let errors=req.validationErrors()
    if(errors.length){
        res.render('review',{
            errors,
            user:req.user
        })
    }else{

        let obj={
            byUser:req.user[0].username,
            review:review,
            ratings:rate
        }

        let newReview=new userReivews(obj)

        newReview.save((err,review)=>{
        if(err) throw err;
        req.flash('success_msg','Thanks For Your Review !!! KEEP CHATTING')
        res.redirect('/account/review')    
        })
    }
})

router.delete('/delete/:id',LoggedIN,(req,res)=>{
    var id = req.params.id;

    mongoUser.deleteOne({_id:id},(err,cb)=>{
        if(err) throw err
        req.flash('success_msg','You have deleted Your Account')
        req.logout()
        res.send('success')
    })
})


module.exports=router