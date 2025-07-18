import {asyncHandler} from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import apiResponse from '../utils/apiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation on empty
  //check if user already exists
   //check for images
   //check for avatar
   //upload them to cloudinary
   //create user object - create entry in db
   //remove password and refresh token field from response
   //check weather user is created successfully
   //return response

const{username,email,fullname,password}= req.body;
console.log("email:",email);

if (
   [username, email, fullname, password].some((field)=>
   field?.trim()==="")
   
){
  throw new apiError(400, "All fields are required")
}
const existedUser = User.findOne({
$or: [{username} , {email}]
})

if(existedUser){
     throw new apiError(409, "User already exists with this username or email")
}

const avatarLocalPath = req.files?.avatar[0]?.path
const coverImageLocalPath  =req.files?.coverImage[0]?.path

if (!avatarLocalPath) {
   throw new apiError(400, "Avatar is required")
}

const avatar= await uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if (!avatar) {
   throw new apiError(400, "Failed to upload avatar to cloudinary")
}

const user = await User.create({
   fullname,
   avatar: avatar.url,
   coverImage: coverImage?.url || "",
   email,
   password,
   username:username.toLowerCase()
})

 const userCreated = await User.findById(user._id).select(
   "-password -refreshToken"
 )

if (!userCreated) {
   throw new apiError(500, "User creation failed")
}

return res.status(201).json(
new apiResponse(200,userCreated, "User registered successfully")

)
})
export {registerUser}