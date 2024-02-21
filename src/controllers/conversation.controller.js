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

	const conversations = await Conversation.find({
		participant: { $in: [_id] },
	});

	res.status(200).json(
		new ApiResponse(200, conversations, "all user you chated prevously")
	);
});