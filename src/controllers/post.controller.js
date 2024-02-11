import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import mongoose from "mongoose";


// @route     POST /api/v1/posts/
// @status    Private
// @desc      upload post
export const addPosts = asyncHandler(async (req, res, next) => {
	const { caption } = req.body;

	const _id = req?.user._id;

	if (!caption) {
		return next(new ApiError(400, "captions is required"));
	}

	const localPostPath = req.file.path;

	if (!localPostPath) {
		return next(400, "image is required to do a post.");
	}

	const post = await uploadOnCloudinary(localPostPath);

	const newPost = await Post.create({
		caption,
		post: {
			url: post?.url,
			public_id: post?.public_id,
		},
		owner: _id,
	});

	res.status(200).json(
		new ApiResponse(200, newPost, "your post is Upload successfully.")
	);
});
// @route     GET /api/v1/posts/all
// @status    public
// @desc      get all posts of all users
export const getAllPosts = asyncHandler(async (req, res, next) => {

	// const user = req?.user._id;

	const posts = await Post.aggregate([
		{
			$lookup: {
				from: "users",
				localField: "owner",
				foreignField: "_id",
				as: "avatar",
			},
		},
		{
			$lookup: {
				from: "likes",
				localField: "_id",
				foreignField: "post",
				as: "totalLikes",
			},
		},
		{
			$addFields: {
				totalLikes: {
					$size: "$totalLikes",
				},
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
	]);

	res.status(200).json(new ApiResponse(200, posts, "all posts"));
});

// @route     GET /api/v1/posts/:userId
// @status    public
// @desc      get posts by users
export const getPostsById = asyncHandler(async (req, res, next) => {
	const { postId } = req.params;

	if (!postId) {
		return next(new ApiError(400, "postid is required !"));
	}

	const post = await Post.aggregate([
		{
			$match: {
				_id: new mongoose.Types.ObjectId(postId),
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "owner",
				foreignField: "_id",
				as: "avatar",
			},
		},
		{
			$lookup: {
				from: "likes",
				localField: "_id",
				foreignField: "post",
				as: "totalLikes",
			},
		},
		{
			$addFields: {
				totalLikes: {
					$size: "$totalLikes",
				},
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
	]);

	if ( post.length == 0  ) {
		throw(new ApiError(401, "post not found 😔"));
	}

	res.status(200).json(new ApiResponse(200, post, "Post😊"));
});

// @route     GET /api/v1/posts/register
// @status    public
// @desc      get all posts of all users
export const getPostsByUser = asyncHandler(async (req, res, next) => {
	const { userId } = req.params;

	if (!userId) {
		throw new ApiError(400, "userId is required");
	}

	const posts = await Post.aggregate([
		{
			$match: {
				owner: new mongoose.Types.ObjectId(userId),
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "owner",
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
	]);

	res.status(200).json(new ApiResponse(200, posts, `All posts of user`));
});

// @route     delete /api/v1/posts/:postId
// @status    Private
// @desc      delete post
export const deletePosts = asyncHandler(async (req, res, next) => {
	const { postId } = req.params;

	if (!postId) {
		return next(new ApiError(400, "post id is required !"));
	}

	const deletePost = await Post.findByIdAndDelete(postId);

	res.status(200).json(
		new ApiResponse(200, deletePost, "this Post is successfully deleted.")
	);
});

// @route     patch /api/v1/posts/:postId
// @status    Private
// @desc      update post
export const updatePosts = asyncHandler(async (req, res, next) => {
	const { postId } = req.params;

	const caption = req.body.caption;

	if (!postId) {
		return next(new ApiError(401, "post is required"));
	}

	const post = await Post.findById(postId);

	post.caption = caption;

	await post.save();

	res.status(200).json(new ApiResponse(200, post, "post is updated."));
});
