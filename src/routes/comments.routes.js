import { Router } from "express";
import {
	addComment,
	deletecomment,
	getCommentByPost,
	getCommentOfUser,
} from "../controllers/comment.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/").get(auth, getCommentOfUser)
router.route("/:postId").get(getCommentByPost);
router.route("/:postId").post(auth, addComment);
router.route("/:commentId").delete(auth, deletecomment);

export default router;
