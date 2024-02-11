import User from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

const checkAuth = asyncHandler(async (req, res, next) => {
	const { accessToken } = req.cookies;

	const decodedToken = jwt?.verify(
		accessToken,
		process.env.ACCESS_TOKEN_SECRET
	) || null ;

	const user = await User.findById(decodedToken?._id).select(
		"-password -refreshToken -savePost "
	);

	req.user = user;

	next();
});

export default checkAuth;
