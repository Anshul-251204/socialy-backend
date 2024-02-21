import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import Like from "../models/like.model.js";

// @route     POST /api/v1/like/:userId
// @status    Private
// @desc      like or unlike by user by user
export const likeToggle = asyncHandler(async (req, res, next) => {
	const { postId } = req.params;

	const checkIsLiked = await Like.findOne({ post: postId });

	if (!checkIsLiked) {
		const liked = await Like.create({
			post: postId,
			likedBy: req.user._id,
		});

		return res
			.status(200)
			.json(new ApiResponse(200, liked, "Post liked successfully"));
	} else {
		await Like.findByIdAndDelete(checkIsLiked._id);
		return res
			.status(200)
			.json(new ApiResponse(200, {}, "Post unliked successfully"));
	}
});

// @route     POST /api/v1/like/:userId
// @status    Private
// @desc      get comments by user
export const likedPostOfUser = asyncHandler(async (req, res, next) => {
	const id = req?.user._id;

	const likedPost = await Like.aggregate([
		{
			$match: {
				likedBy: id,
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "likedBy",
				foreignField: "_id",
				as: "userName",
			},
		},
		{
			$addFields: {
				avatar: {
					$first: "$userName.avatar",
				},
				userName: {
					$first: "$userName.userName",
				},
			},
		},
		{
			$lookup: {
				from: "posts",
				localField: "post",
				foreignField: "_id",
				as: "post",
			},
		},
		{
			$addFields: {
				post: {
					$first: "$post",
				},
				
			},
		},
	]);

	res.status(200).json(
		new ApiResponse(200, likedPost, "All liked post by users ❤️")
	);
});

export const isLiked = asyncHandler(async (req, res, next) => {
	const { postId } = req.params;

	const liked = await Like.findOne({ likedBy: req.user._id, post:postId });

	if (liked) {
		res.status(200).json(new ApiResponse(200, {}, "liked"));
	} else {
		res.status(200).json(new ApiResponse(200, {}, "unliked" , false));
	}
});
