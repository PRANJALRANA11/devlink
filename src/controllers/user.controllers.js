import { asyncHandler } from "../utils/asyncHandler.utils.js";

const UserRegister = asyncHandler(async (req,res)=>{
    res.status(200).json({message:"go"})
})

export {UserRegister}