let express=require('express')
let APIRouter=express.Router()

let  {registerUser, LoginUser,getUser, writeReview,} = require('./userAPIRoutes')
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
APIRouter.get('/allReviews', async (req,res)=>{
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