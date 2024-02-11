import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import Follow from "../models/follow.model.js";

// @route     POSt /api/v1/follow/:userId
// @status    Private
// @desc      follow users
export const followUser = asyncHandler(async (req, res, next) => {
	const { userId } = req.params;

	if (!userId) throw new ApiError(400, "userId is required !");

	const follow = await Follow.findOne({ user: req?.user._id, follower: userId });

    if(!follow) {
        const follows = await Follow.create({
            user:req?.user._id,
            follower:userId
        })

        return res.status(200).json(
            new ApiResponse(200, follows, "your follow the user")   
        )
    }else{

        await Follow.findByIdAndDelete(follow._id);
         return res
				.status(200)
				.json(new ApiResponse(200, {}, "your unfollow the user"));
    }
});


