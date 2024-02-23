import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { getStory, uploadStory } from "../controllers/story.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.use(auth);
router.route("/").post(auth, upload.single("story"), uploadStory);
router.route("/").get(auth, getStory);

export default router;