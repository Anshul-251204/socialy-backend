import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

// @route     POST /api/v1/comments/:postId
// @status    Private
// @desc      upload comments
export const addComment = asyncHandler(async (req, res, next) => {
	const { content } = req.body;
	const { postId } = req.params;



	if (!content) {

		return next(new ApiError(400, "comment is required"));
	}

	const comment = await Comment.create({
		content,
		post: postId,
		commentBy: req.user._id,
	});

	res.status(200).json(
		new ApiResponse(200, comment, "your comment is Upload successfully.")
	);
});

// @route     DELETE /api/v1/comments/:commentId
// @status    Private
// @desc      delete comments
export const deletecomment = asyncHandler(async (req, res, next) => {
	const { commentId } = req.params;

	if (!commentId) {
		throw new ApiError(400, "comment is required");
	}

	const comment = await Comment.findByIdAndDelete(commentId);

	res.status(200).json(
		new ApiResponse(200, comment, "your comment is deleted successfully.")
	);
});

// @route     GET /api/v1/comments/:postId
// @status    Private
// @desc      get comments by Post
export const getCommentByPost = asyncHandler(async (req, res, next) => {
	const { postId } = req.params;

	if (!postId) {
		throw new ApiError(400, "post id is required !");
	}

	const comments = await Comment.aggregate([
		{
			$match: {
				post: new mongoose.Types.ObjectId(postId),
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "commentBy",
				foreignField: "_id",
				as: "avatar",
			},
		},
		{
			$addFields: {
				avatar: {
					$first: "$avatar.avatar",
				},
				userName: {
					$first: "$avatar.userName",
				},
			},
		},{
			$sort:{
				createdAt:-1
			}
		}
	]);

	res.status(200).json(new ApiResponse(200, comments, "all comments"));
});


export const getCommentOfUser = asyncHandler(async (req, res, next) => {
	
	const id = req?.user._id;
	
	const comments = await Comment.aggregate([
		{
			$match: {
				commentBy: new mongoose.Types.ObjectId(id),
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "commentBy",
				foreignField: "_id",
				as: "avatar",
			},
		},
		{
			$addFields: {
				avatar: {
					$first: "$avatar.avatar",
				},
				userName: {
					$first: "$avatar.userName",
				},
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]);

	res.status(200).json(new ApiResponse(200, comments, "all comments"));
});

