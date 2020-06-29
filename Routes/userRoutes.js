let express=require('express')
let Router=express.Router()
let mongoUser=require('../Model/user')
let bcrypt=require('bcryptjs')
let chat=require('../Model/chat')






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


let router=express.Router()
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

        mongoUser.updateOne({_id:id},{$set:{username:username,email:email}},(err,cb)=>{
        if(err) throw err

                    
            let name=hiddenUsername
            chat.find({},(err,user)=>{
                if(err) throw err
                user.forEach((val,index,arr)=>{
                    let ar=val.users
                    let check=ar.includes(name)

                    if(check){
                        let  index=ar.indexOf(name)
                        ar[index]=username

                        chat.updateOne({_id:val._id},{$set:{users:ar}},(err,cd)=>{
                            if(err) throw err;
                            console.log('Updated chats')
                        })
                    }else{
                        console.log('chats not updated')
                    }
                })
            })
        req.flash('success_msg','Successfully Updated your data')
        res.redirect('/account')
        })
        //Checking if user already exist    
    }

})

router.post('/delete',(req,res)=>{

    let id=req.body.id;

    mongoUser.deleteOne({_id:id},(err,cb)=>{
        if(err) throw err
        req.flash('success_msg','You have deleted Your Account')
        req.user=''
        res.redirect('/Login')
    })
})


router.delete('/delete/:id',(req,res)=>{
    var id = req.params.id;

    mongoUser.deleteOne({_id:id},(err,cb)=>{
        if(err) throw err
        req.flash('success_msg','You have deleted Your Account')
        req.logout()
        res.send('success')
    })
})




module.exports=router