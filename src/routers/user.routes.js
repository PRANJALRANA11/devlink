import { Router } from "express";
import { UserRegister,UserLogin ,UserLogout,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getWatchHistory} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyUser from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), UserRegister);
router.post("/login", UserLogin);
router.post("/logout",verifyUser, UserLogout);
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyUser, changeCurrentPassword)
router.route("/current-user").get(verifyUser, getCurrentUser)
router.route("/update-account").patch(verifyUser, updateAccountDetails)

router.route("/avatar").patch(verifyUser, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyUser, upload.single("coverImage"), updateUserCoverImage)
router.route("/c/:username").get(verifyUser, getUserChannelProfile)
router.route("/history").get(verifyUser, getWatchHistory)
export default router;