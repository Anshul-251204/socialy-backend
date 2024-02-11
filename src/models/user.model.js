import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = mongoose.Schema({
	fullName: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: [true, "userName is required"],
		unique: true,
		lowercase: true,
		trim: true,
		index: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowecase: true,
		trim: true,
	},
	avatar: {
		url: {
			type: String,
			required: true,
		},
		public_id: {
			type: String,
			required: true,
		},
	},
	password: {
		type: String,
		minLength: [4, "password mush be 4 words"],
		maxLength: [8, "password can't be exited 8 words"],
		required: true,
	},
	bio: {
		type: String,
		minLength: [4, "bio have minimun 4 words"],
		maxLength: [150, "bio can't exided 150 words"],
	},
	savePost: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "post",
		},
	],
	isPrivate: {
		type: Boolean,
		default: false,
	},
	refreshToken: String,
});

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

userSchema.methods.checkPassword = async function checkPassword(password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
	const playload = {
		_id: this._id,
		email: this.email,
		userName: this.userName,
		avatar: this.avatar,
	};
	const token = jwt.sign(playload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
	});

	return token;
};

userSchema.methods.generateRefreshToken = async function () {
	const playload = {
		_id: this._id,
	};
	const token = jwt.sign(playload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
	});

	return token;
};

const User = mongoose.model("User", userSchema);

export default User