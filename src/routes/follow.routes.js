import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { followUser } from "../controllers/follow.controllers.js";

const router = Router();


router.use(auth);

router.route("/:userId").post(auth, followUser)
export default  router;
