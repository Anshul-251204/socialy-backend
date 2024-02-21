import { Router } from "express";
import { getChatedUsers } from "../controllers/conversation.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(auth, getChatedUsers);


export default router