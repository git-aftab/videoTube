import {Like} from "../models/like.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import mongoose,{ isValidObjectId } from "mongoose"


// Controllers
const likeVideo = asyncHandler(async(req,res)=>{
    // TODO: 
})
