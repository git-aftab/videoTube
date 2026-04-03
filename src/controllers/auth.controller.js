import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
} from "../utils/mail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Generate AcessToken and RefreshToken for users
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccesstoken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something Went Wrong while generating the access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists.", []);
  }

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });

  //   After user is create generate the temp_token
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.Save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please Verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`, //generate a dynamic link of localhost or hosted
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailverificationToken -emailVerificationToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the User.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User Registered Successfully and email has been sent",
      ),
    );
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !username) {
    throw new ApiError(400, "Username and Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exists.");
  }

  if (user.loginType !== "EMAIL_PASSWORD") {
    throw new ApiError(
      400,
      `You are registered with ${user.loginType}. Please use that to login.`,
    );
  }

  const ispassValid = await user.isPasswordCorrect(password);
  if (!ispassValid) {
    throw new ApiError(404, "Invalid Credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("acessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

// get current User
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched successfully"));
});

// VerifyEmail
const verifyEmail = asyncHandler(async (req, res) => {});

// ResendEmailVerification
const resendEmailVerification = asyncHandler(async (req, res) => {});

// refreshAccessToken
const refreshAccessToken = asyncHandler(async (req, res) => {});

// forgotPasswordRequest
const forgotPasswordRequest = asyncHandler(async (req, res) => {});

// resetForgotPassword
const resetForgotPassword = asyncHandler(async (req, res) => {});

// changeCurrentPassword
const changeCurrentPassword = asyncHandler(async (req, res) => {});

export {
  generateAccessTokenAndRefreshToken,
  loginUser,
  logoutUser,
  registerUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword,
};
