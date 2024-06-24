import { Router } from "express";
import { UserRegister,UserLogin ,UserLogout} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyUser from "../middlewares/auth.middlewares.js";
const router = Router();

router.post("/register", upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), UserRegister);
router.post("/login", UserLogin);
router.post("/logout",verifyUser, UserLogout);

export default router;