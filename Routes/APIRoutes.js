let express=require('express')
let APIRouter=express.Router()

let {registerUser, LoginUser, getUser, writeReview, getAllUsers, searchUser} = require('../services/userService')
let reviews=require('../Model/review')
let {verifyToken} = require('../Middlewares/authMiddleare')


APIRouter.post('/user/register', registerUser)
APIRouter.post('/user/login', LoginUser)
APIRouter.get('/user/me', verifyToken,getUser)
APIRouter.get('/user/verifytoken', verifyToken)
APIRouter.post('/user/me/writeReview',writeReview)

/**
 * @route GET /api/users
 * @desc Get 20 users(Except for the loggedin user)
 * @param int page - (Optional) The Current Page
 * @return {object[]} users, the total num of users and current page
 * @example /users?page=3
 */
APIRouter.get('/users', verifyToken, getAllUsers)

/**
 * @route GET /api/searchuser
 * @desc Get users by username or email
 * @param string search - (Required) The string to search user
 * @return {object[]} users
 * @example /searchuser?search=waseem
 */

APIRouter.get('/searchuser', verifyToken,searchUser)


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


module.exports = APIRouter