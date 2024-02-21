import { Router } from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import auth from "../middlewares/auth.middleware.js";
const router = Router();


router.route("/get/:toChatUserId").get(auth , getMessage);
router.route("/send/:receiverId").post(auth, sendMessage);


export default router;
