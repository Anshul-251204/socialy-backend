import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary, deletefile } from "../utils/Cloudinary.js";
import Follow from "../models/follow.model.js";

const generateAccessAndRefreshToken = async (userId) => {
	try {
		const user = await User.findById(userId);
		const accessToken = await user.generateAccessToken();
		const refreshToken = await user.generateRefreshToken();

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		console.log(error);
	}
};

// @route     POSt /api/v1/users/register
// @status    public
// @desc      register user
const registerUser = asyncHandler(async (req, res, next) => {
	const { fullName, userName, email, password } = req.body;

	if (!fullName || !userName || !email || !password) {
		return next(new ApiError(400, "All Fields Are Required !"));
	}

	const avatarLocalPath = req.file?.path;

	if (!avatarLocalPath) {
		return next(new ApiError(400, "Avatar Is Required !"));
	}

	const existsUser = await User.findOne({ userName: userName });

	if (existsUser) {
		fs.unlinkSync(avatarLocalPath);
		return next(new ApiError(400, "User Is Already Exists !"));
	}

	const avatar = await uploadOnCloudinary(avatarLocalPath);

	const user = await User.create({
		fullName,
		email,
		password,
		userName: userName.toLowerCase(),
		avatar: {
			url: avatar?.url,
			public_id: avatar?.public_id,
		},
	});

	const optionsForAccess = {
		httpOnly: true,
		secure: true,
	};

	const optionsForResfresh = {
		httpOnly: true,
		secure: true,
		expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
	};

	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
		user._id
	);

	const registerUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	if (!registerUser) {
		return next(
			new ApiError(500, "internal server error while creating user!")
		);
	}

	res.status(200)
		.cookie("accessToken", accessToken, optionsForAccess)
		.cookie("refreshToken", refreshToken, optionsForResfresh)
		.json(
			new ApiResponse(200, registerUser, "User Loged in Successfully.")
		);
});

// @route      POSt /api/v1/users/login
// @status     Public
// @desc       login user
const loginUser = asyncHandler(async (req, res, next) => {
	const { userName, password } = req.body;

	if (!userName || !password) {
		return next(new ApiError(400, "all fields are required !"));
	}

	const user = await User.findOne({ userName });

	if (!user) {
		return next(new ApiError(404, "user not found with this username !"));
	}

	const isMatch = await user.checkPassword(password);

	if (!isMatch) {
		return next(new ApiError(401, "username or password is incorrect !"));
	}

	const logedInUser = await User.findById(user._id)?.select("-password ");

	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
		user._id
	);

	const optionsForAccess = {
		httpOnly: true,
		secure: true,
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
	};

	const optionsForResfresh = {
		httpOnly: true,
		secure: true,
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
	};

	res.status(200)
		.cookie("accessToken", accessToken, optionsForAccess)
		.cookie("refreshToken", refreshToken, optionsForResfresh)
		.json(new ApiResponse(200, logedInUser, "User Loged in Successfully."));
});

// @route      POSt /api/v1/users/update
// @status     Private
// @desc       logout user
const logoutUser = asyncHandler(async (req, res, next) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$unset: {
				refreshToken: 1, // this removes the field from document
			},
		},
		{
			new: true,
		}
	);

	const optionsForAccess = {
		httpOnly: true,
		secure: true,
	};

	const optionsForResfresh = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.clearCookie("accessToken", optionsForAccess)
		.clearCookie("refreshToken", optionsForResfresh)
		.json(new ApiResponse(200, {}, "User logged Out"));
});

const updateDetails = asyncHandler(async (req, res, next) => {
	const { email, fullName } = req.body;
	console.log();

	if (!email || !fullName) {
		return next(new ApiError(400, "all Fields are required"));
	}

	const user = await User.findByIdAndUpdate(
		req.user?._id,
		{
			$set: {
				fullName,
				email: email,
			},
		},
		{ new: true }
	).select("-password -refreshToken");

	return res
		.status(200)
		.json(
			new ApiResponse(200, user, "Account details updated successfully")
		);
});
// @route      POSt /api/v1/users/avatar
// @status     public
// @desc       change profile of user
const updateAvatar = asyncHandler(async (req, res, next) => {

	
	const avatarLocalPath = req.file?.path;

	if (!avatarLocalPath) {
		throw new ApiError(400, "Avatar file is missing");
	}

	await deletefile(req.user.avatar.public_id);

	const avatar = await uploadOnCloudinary(avatarLocalPath);

	if (!avatar.url) {
		throw new ApiError(400, "Error while uploading on avatar");
	}

	const user = await User.findByIdAndUpdate(
		req.user?._id,
		{
			$set: {
				avatar: {
					url: avatar.url,
					public_id: avatar.public_id,
				},
			},
		},
		{ new: true }
	).select("-password");

	return res
		.status(200)
		.json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

// @route      POSt /api/v1/users/bio
// @status     Private
// @desc       update bio user
const updateBio = asyncHandler(async (req, res, next) => {
	const { bio } = req.body;

	if (!bio) {
		throw new ApiError(400, "content is required");
	}

	const user = await User.findByIdAndUpdate(
		req.user?._id,
		{
			bio: bio,
		},
		{ new: true }
	).select("-password");

	return res
		.status(200)
		.json(new ApiResponse(200, user, "Bio is updated successfully"));
});

// @route      PATCH /api/v1/users/password
// @status     Private
// @desc       change passwored user
const changePassword = asyncHandler(async (req, res, next) => {
	const { oldPassword, newPassword } = req.body;

	if (!oldPassword || !newPassword) {
		return next(new ApiError(400, "all fileds are required"));
	}

	const user = await User.findById(req.user._id);

	const isMatch = await user.checkPassword(oldPassword);

	if (!isMatch) {
		return next(new ApiError(401, "Password is incorrect !"));
	}

	user.password = newPassword;

	await user.save();

	res.status(200).json(
		new ApiResponse(200, {}, "your password is changed successfully.")
	);
});
// @route      PATCH /api/v1/users/:userId
// @status     Private
// @desc       reset password user
const resetPassword = asyncHandler(async (req, res, next) => {}); //pending
// @route      DELETE /api/v1/users/resetpassword
// @status     Private
// @desc       delete user account
const deleteUser = asyncHandler(async (req, res, next) => {
	const { password } = req.body;

	if (!password) {
		return next(new ApiError(400, "password is required !"));
	}

	const user = await User.findById(req.user._id);

	const isMatch = await user.checkPassword(password);

	if (!isMatch) {
		return next(new ApiError(401, "password is incorrect !"));
	}

	await User.deleteOne({ _id: req.user._id });

	const optionsForAccess = {
		httpOnly: true,
		secure: true,
	};

	const optionsForResfresh = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.clearCookie("accessToken", optionsForAccess)
		.clearCookie("refreshToken", optionsForResfresh)
		.json(new ApiResponse(200, {}, "your successfully deleted."));
});
// @route      GET /api/v1/users
// @status     Private
// @desc      get profile of user
const getUserProfile = asyncHandler(async (req, res, next) => {
	const { userName } = req.params;

	let profilePage = await User.aggregate([
		{
			$match: {
				userName: userName,
			},
		},
		{
			$lookup: {
				from: "posts",
				localField: "_id",
				foreignField: "owner",
				as: "posts",
			},
		},
		{
			$lookup: {
				from: "follows",
				localField: "_id",
				foreignField: "user",
				as: "following",
			},
		},
		{
			$addFields: {
				following: {
					$size: "$following",
				},
			},
		},
		{
			$lookup: {
				from: "follows",
				localField: "_id",
				foreignField: "follower",
				as: "follower",
			},
		},
		{
			$addFields: {
				follower: {
					$size: "$follower",
				},
			},
		},
	]);

	if (req.user) {
		let isfollowing = await Follow.findOne({
			user: req?.user._id,
			follower: profilePage[0]._id,
		});

		
		isfollowing
			? (profilePage[0].isfollow = true)
			: (profilePage[0].isfollow = false);
	}

	res.status(200).json(
		new ApiResponse(200,profilePage[0], "your profile pages")
	);
});
// @route      patch /api/v1/users/refreshtoken
// @status     Private
// @desc       token refresh
const refreshToken = asyncHandler(async (req, res, next) => {
	const incomingRefreshToken = req.cookies.refreshToken;

	if (!incomingRefreshToken) {
		return next(new ApiError(401, "unauthorized request"));
	}

	const decodedToken = await jwt.verify(
		incomingRefreshToken,
		process.env.REFRESH_TOKEN_SECRET
	);

	const user = await User.findById(decodedToken._id);

	if (incomingRefreshToken !== user.refreshToken) {
		return next(new ApiError(401, "invaild refreshtoken !"));
	}
	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
		user._id
	);

	user.refreshToken = refreshToken;

	await user.save({ validateBeforeSave: false });

	const optionsForAccess = {
		httpOnly: true,
		secure: true,
	};

	const optionsForResfresh = {
		httpOnly: true,
		secure: true,
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
	};

	return res
		.status(200)
		.cookie("accessToken", accessToken, optionsForAccess)
		.cookie("refreshToken", refreshToken, optionsForResfresh)
		.json(
			new ApiResponse(
				200,
				{
					accessToken: accessToken,
					refreshToken: refreshToken,
				},
				"Access token refreshed"
			)
		);
});

// @route      patch /api/v1/users/refreshtoken
// @status     Private
// @desc       set user accout private or public
const toogleAccountStatus = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);

	if (user.status == "private") {
		user.status = "public";
	} else {
		user.status = "private";
	}
	user.save();

	res.status(200).json(
		new ApiResponse(
			200,
			user,
			user.status == "public"
				? "your accout is public now."
				: "your accout is private now."
		)
	);
});

const searchUserByUserName = asyncHandler(async (req, res, next) => {
	
	const { query } = req.query;

	if (!query) {
		return next(new ApiError(400, "query is requried"));
	}
	const users = await User.aggregate([
		{
			$match: { userName: { $regex: query, $options: "i" } },
		},
		{
			$project: {
				avatar: 1,
				userName: 1,
			},
		},
	]);

	res.status(200).json(new ApiResponse(200, users, "all User"));
});

export {
	registerUser,
	loginUser,
	logoutUser,
	updateAvatar,
	changePassword,
	updateDetails,
	deleteUser,
	toogleAccountStatus,
	searchUserByUserName,
	refreshToken,
	updateBio,
	getUserProfile,
};
