import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import User from "../models/user.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

const generateAccessTokenAndRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validationBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (error) {
        return error;
    }
}

const UserRegister = asyncHandler(async (req, res) => {
    const { username, fullName, email, password } = req.body;
    const avatar = req.files.avatar[0].path;
    const coverImage = req.files?.coverImage[0]?.path;

    // validation
    if ([username, fullName, email, password].some((item) => item?.trim() === "")) {
        throw new ApiError(400, `${item} is empty`)
    }
    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }
    console.log(avatar)

    // check if user exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
        throw new ApiError(400, "User already exists")
    }
    // Upload assets on cloudinary
    const avatarResponse = await uploadOnCloudinary(avatar);
    const coverImageResponse = coverImage ? await uploadOnCloudinary(coverImage) : null;
    if (!avatarResponse) throw new ApiError(500, "Failed to upload avatar on cloudinary")

    // create user
    const user = await User.create({
        username,
        fullName,
        email,
        password,
        avatar: avatarResponse.url,
        coverImage: coverImageResponse?.url
    })
    if (!user) {
        throw new ApiError(500, "Failed to create user")
    }
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    return res.status(201).json(new ApiResponse(201, createdUser, "user has been created successfully"))


})
const UserLogin = asyncHandler(async (req, res) => {
    // req user cred
    // password match
    // generate access refresh
    // cookies
    const { username, email, password } = req.body;
    if (!username || !email || !password) return new ApiError(400, "Please provide username,email and password");
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) return new ApiError(400, "User not found");
    let validatedPassword = await user.verifyPassword(password);
    if (!validatedPassword) return new ApiError(400, "Invalid password");
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )


})
const UserLogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))

})

export { UserRegister, UserLogin, UserLogout }