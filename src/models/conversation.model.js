import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
	{
		participant: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
		message: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
				default:[]
			},
		],
		lastMessage:{
			type: String,
			default:"🔥"
			
		}
	},
	{ timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;