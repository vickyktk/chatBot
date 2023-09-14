let mongoUser=require('../Model/user')
let bcrypt=require('bcryptjs')
let jwt = require('jsonwebtoken')
let userReivews=require('../Model/review')

// @desc Register a user 
// @type POST
// @route /api/user/register
// @return user object
const registerUser = async (req,res)=>{
    const {username,email,password} = req.body
    if(!username || !email || !password) {
        return res.status(400).send("Please fill out all the fields")
    }
    req.checkBody('username','Username Must be 5 characters Long').notEmpty().escape().isLength({min:5,max:15})
    req.checkBody('email','enter a valid Email Address').notEmpty().isEmail()
    req.checkBody('password','Password must be at least 6 charcters long').notEmpty().isLength({min:6})
    let errors=req.validationErrors()
    if(errors.length){
        // Validtion errors so bail out
        return res.status(400).send({errors})
    }


    // check if user exists
    const userExist = await mongoUser.findOne({email})
    if(userExist) {
        return res.status(400).send({errors:[{
            userExist:'User exist ,Please try another email address'
        }]})
    }


    const salt = await bcrypt.genSalt(10)
    const hashedPassword = bcrypt.hash(password, salt)
    const user = await mongoUser.create({
        username,email,hashedPassword,
        googleID:'',
        FBID:'',
        password,
        status:0,
        token:""
    })
    if(user) {
        // Creat JWT Login Token
        let token = GenerateTokenJWT(user._id)
        user.token = token
        return res.status(201).json({
            _id:user.id,
            username:user.username,
            email:user.email,
        })
    } else {
        res.status(400).send({errors:[
            {
                userError:"Could not create User, Please try again"
            }
        ]}) 
    }

}


// @desc Login a user 
// @type POST
// @route /api/user/login
// @return user object

const LoginUser = async (req,res)=>{

    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).send("Please Enter both Email and Password")
        }
        var user = await mongoUser.findOne({email})

        if(user && (await bcrypt.compare(password, user.password))) {
            // Creat JWT Login Token
            let token = GenerateTokenJWT(user._id)
            user.token = token
            // Send User 
            return res.status(200).json(user)
        } else {
            return res.status(400).send({message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({message:"Something Went Wrong, Please try Again"})
    }
}

const getUser = async (req,res)=>{
    var user = await mongoUser.findOne({_id:req.user_id})

    const thisUserReivews = await userReivews.find({byUser:req.user_id}) 
    return res.status(200).json({
        user:user,
        reviews:thisUserReivews
    })
}

const writeReview = async (req,res)=>{
    const {review,ratings} = req.body
    var date = new Date();
	var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
    req.checkBody('review','Please add a review').notEmpty()
    req.checkBody('ratings','Please Consider rating us').notEmpty()
    let errors=req.validationErrors()
    if(errors.length){
        // Validtion errors so bail out
        return res.status(400).send({errors})
    }

    const newReview = await userReivews.create({
        byUser:req.user._id,
        username:req.user.username,
        review,
        ratings,
        date:current_date,
    })
    if(!newReview) {
        res.status(400).send({errors:[
            {
                rewError:"Could not write review, Please try again"
            }
        ]}) 
    } else {
        const thisUserReivews = await userReivews.find({byUser:req.user._id})
        return res.status(200).json({
            reviews:thisUserReivews
        }) 
    }
}
const GenerateTokenJWT = (id)=>{
    return jwt.sign(
        {id},
        process.env.TOKEN_KEY,
        {
            expiresIn:"2h"
        }
    )
}
module.exports = {
    registerUser,
    LoginUser,
    getUser,
    writeReview,
    mongoUser
}