import { Router } from "express";
import {
	addPosts,
	deletePosts,
	getAllPosts,
	getPostsById,
    getUserPost,
    updatePosts,
} from "../controllers/post.controller.js";
import upload from "../middlewares/multer.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import  checkAuth  from "../middlewares/chechAuth.middleware.js"
const router = Router();

router.route("/")
    .get( getAllPosts)
    .post(upload.single("post"), auth, addPosts);

router.route("/:postId")
    .get(getPostsById)
    .patch(updatePosts)
    .delete(deletePosts);

router.route("/userpost").get(auth,getUserPost);    

export default router;
