let express=require('express')
let APIRouter=express.Router()

let  {registerUser, LoginUser,getUser, writeReview, mongoUser} = require('./userAPIRoutes')
let reviews=require('../Model/review')
let {verifyToken} = require('../Middlewares/authMiddleare')


APIRouter.post('/user/register', registerUser)
APIRouter.post('/user/login', LoginUser)
APIRouter.get('/user/me', verifyToken,getUser)
APIRouter.get('/user/verifytoken', verifyToken)
APIRouter.post('/user/me/writeReview',writeReview)


/**
 * @desc Get all the reviews
 * @route /api/allReviews
 * @return Reviews (Array)
 */
APIRouter.get('/allReviews', async(req,res)=>{
    let id = req.user ? req.user._id:"jh45345jbhsf"
    try {
        let allReviews = await reviews.find({byUser:{$ne:id}}).sort({date:-1})
        if(allReviews){
            res.status(200).json({allReviews})
        } else {
            res.status(200).json({allReviews:[]})
        }
    } catch (error) {
       res.status(400).send("There was an error fetching reviews") 
    }
})

/**
 * @route GET /api/users
 * @desc Get 20 users(Except for the loggedin user)
 * @param int page - (Optional) The Current Page
 * @return {object[]} users, the total num of users and current page
 * @example /users?page=3
 */

APIRouter.get('/users', verifyToken, async(req,res)=>{
    try {
        const {page = 1} = req.query
        const id = req.user ? req.user._id:"jh45345jbhsf"
        const users = await mongoUser.find({_id:{$ne:id}},{ password: 0 }).limit(20).skip((page-1) * 20);
        const totalUsers = await mongoUser.count();
        res.status(200).json({
            users,
            totalUsers,
            current:page
        })
    } catch (error) {
       res.status(400).send("There was an error fetching users" + error) 
    }
    
})


APIRouter.get('/searchuser', verifyToken, async(req,res)=>{
    try {
        const { search = '' } = req.query
        const users = await mongoUser.find({
           $or: [
               { username: { $regex: search, $options: 'i' } },
               { email: { $regex: search, $options: 'i' } },
           ],    
       },
       { password: 0 }
       );

       res.status(200).json(users)
    } catch (error) {
       res.status(400).send("There was an error fetching users" + error) 
    }
})

module.exports = APIRouter