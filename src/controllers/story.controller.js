import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import Story from "../models/story.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

// @route     POSt /api/v1/story/
// @status    private
// @desc      upload story user
export const uploadStory = asyncHandler(async(req,res,next)=>{

    const localFilePath = req.file?.path;

    if(!localFilePath) {
        throw new ApiError(400,"Image is required !")
    }

    const image = await uploadOnCloudinary(localFilePath);


    const story = await Story.create({
        owner:req?.user._id,
        story:{
            url:image?.url,
            public_id:image?.public_id
        }
    })

    res.status(200).json(
        new ApiResponse(200, story, "your story upload Successfull")
    )


})

// @route     get /api/v1/story/
// @status    private
// @desc      getfriend story user
