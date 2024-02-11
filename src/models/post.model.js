import mongoose from "mongoose";

const postsSchema = mongoose.Schema(
	{
		caption: {
			type: String,
			maxLength: [150, "caption can't be exited 150 words"],
		},
		post: {
            url: {
                type: String,
				required: true,
			},
			public_id: {
                type: String,
				required: true,
			},
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		views: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Post", postsSchema);

export default Post;
