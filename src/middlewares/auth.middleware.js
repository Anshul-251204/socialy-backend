import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

const auth = asyncHandler(async (req, res, next) => {
	
	const { accessToken } = req?.cookies;

	if (!accessToken) {
		return next(new ApiError(401, "unauthorized user !!!"));
	}

	const decodedToken = jwt.verify(
		accessToken,
		process.env.ACCESS_TOKEN_SECRET
	);

	const user = await User.findById(decodedToken?._id).select(
		"-password -refreshToken"
	);

	if (!user) {
		return next(new ApiError(401, "Invail access Token"));
	}

	req.user = user;

	next();
});

export default auth;
