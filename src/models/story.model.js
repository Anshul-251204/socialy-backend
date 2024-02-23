// import mongoose from "mongoose";

// const reelSchema = mongoose.Schema(
// 	{
// 		caption: {
// 			type: String,
// 			maxLength: [8, "password can't be exited 150 words"],
// 		},
// 		reel: {
// 			url: {
// 				type: String,
// 				required: true,
// 			},
// 			public_id: {
// 				type: String,
// 				required: true,
// 			},
// 			required: true,
// 		},
// 		owner: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "User",
// 		},
// 		views: {
// 			type: Number,
// 			default: 0,
// 		},
// 	},
// 	{
// 		timestamps: true,
// 	}
// );

// const Reel = mongoose.model("Reel", reelSchema);

// export default Reel;

import mongoose from "mongoose";

const storySchema = mongoose.Schema({
	owner:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	story:{
		url:{
			type:String,
			required:true
		},
		public_id:{
			type:String,
			required:true
		}
	}
},{ timestamps:true});

const Story = mongoose.model("Story", storySchema);

export default Story;
