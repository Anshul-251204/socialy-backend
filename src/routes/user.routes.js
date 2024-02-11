import { Router } from "express";
import { changePassword, deleteUser, getUserProfile, loginUser, logoutUser, refreshToken, registerUser, toogleAccountStatus, updateAvatar, updateBio, updateDetails,  } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import checkAuth from "../middlewares/chechAuth.middleware.js";
const router = Router();

router.route("/").post(upload.single("avatar"), registerUser)
router.route("/login").post(loginUser);
router.route("/logout").post(auth , logoutUser);
router.route("/update").patch(auth, updateDetails);
router.route("/avatar").patch(upload.single("avatar"), auth, updateAvatar);
router.route("/bio").patch(auth, updateBio);
router.route("/changepassword").patch(auth, changePassword);
router.route("/delete").delete(auth, deleteUser);
router.route("/refreshtoken").post(refreshToken);
router.route("/status").patch(auth, toogleAccountStatus);
router.route("/:userName").get(checkAuth, getUserProfile);

export default router