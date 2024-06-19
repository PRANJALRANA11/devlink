import { Router } from "express";
import { UserRegister } from "../controllers/user.controllers.js";

const router = Router();

router.get("/register", UserRegister);

export default router;