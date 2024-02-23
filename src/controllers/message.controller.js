import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// @route     POST /api/v1/message/:userId
// @status    Private
// @desc      send message by user to user
export const sendMessage = asyncHandler(async (req, res, next) => {
	const { receiverId } = req.params;
	const { message } = req.body;
	const senderId = req.user._id;


	if (!receiverId || !message) {
		throw new ApiError(400, "Message is Required to send");
	}
	let conversation = await Conversation.findOne({
		participant: { $all: [senderId, receiverId] },
	});

	if (!conversation) {
		conversation = await Conversation.create({
			participant: [senderId, receiverId],
		});
	}

	const newMessage = new Message({
		senderId: senderId,
		receiverId: receiverId,
		message: message,
	});


	if (newMessage) {
		conversation.lastMessage = message
		conversation.message.push(newMessage._id);
	}

    await Promise.all([ conversation.save(),newMessage.save() ]);

	res.status(200).json(
		new ApiResponse(200, newMessage, "message send successfully")
	);
});

// @route     Get /api/v1/message/:ChatId
// @status    Private
// @desc      send message by user to user
export const getMessage = asyncHandler(async(req,res,next)=>{
    const{ toChatUserId } = req.params;
    const senderId = req.user._id

    let conversation = await Conversation.findOne({
        participant:{$all: [senderId, toChatUserId]}
    }).populate("message")

    res.status(200).json(
        new ApiResponse(200, conversation.message, "all message")
    )   
    
})

