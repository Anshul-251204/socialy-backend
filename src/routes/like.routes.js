import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import checkAuth from "../middlewares/chechAuth.middleware.js"
import { isLiked, likeToggle, likedPostOfUser } from "../controllers/like.controller.js";

const router = Router();

router.use(auth);
router.route("/").get(auth, likedPostOfUser)
router.route("/:postId").post(auth, likeToggle)
router.route("/:postId").get(checkAuth, isLiked);

export default router;