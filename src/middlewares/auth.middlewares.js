import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { User } from "../models/user.models.js";

const verifyUser = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    next();
})
export default verifyUser;
