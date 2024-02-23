import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// @route     Get /api/v1/conversation/
// @status    Private
// @desc      get chated user 
export const getChatedUsers = asyncHandler(async (req, res, next) => {
	const _id = req.user._id;

	
	const conversations = await Conversation.aggregate([
		{
			$match: {
				participant: _id,
			},
		},
		{
			$addFields: {
				sender: {
					$arrayElemAt: ["$participant", 0],
				},
				recevier: {
					$arrayElemAt: ["$participant", 1],
				},
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "recevier",
				foreignField: "_id",
				as: "avatar",
			},
		},
		{
			$addFields: {
				avatar: {
					$first: "$avatar.avatar.url",
				},
				userName: {
					$first: "$avatar.userName",
				},
			},
		},
		{
			$project: {
				userName: 1,
				avatar: 1,
				_id: 1,
				createdAt: 1,
				updatedAt: 1,
				lastMessage: 1,
				sender: 1,
				recevier: 1,
			},
		},{
			$sort:{
				updatedAt:-1
			}
		}
	]);

	res.status(200).json(
		new ApiResponse(200, conversations, "all user you chated prevously")
	);
});