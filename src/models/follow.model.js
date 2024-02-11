import mongoose from "mongoose";

const followSchema = mongoose.Schema({
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	follower: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
