import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { uploadStory } from "../controllers/story.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.use(auth);
router.route("/").post(auth, upload.single("storyImage"), uploadStory);

export default router;