import { Router } from "express";
import {
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
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Unsecure Routes --> these don't require JWT

// registerUser
router.route("/register").post(registerUser);

// loginUser
router.route("/login").post(loginUser);

// verifyEmail
router.route("/verify-email/:verificationToken").post(verifyEmail);

// refreshAccessToken
router.route("/refresh-token").post(refreshAccessToken);

// forgotPassword
router.route("/forgot-password").post(forgotPasswordRequest);

// resetFrogotPassword
router.route("/reset-password").post(resetForgotPassword);

// Secure routes --> hit after user is logged in
router.use(verifyJWT);

// Logout
router.route("/logout").post(logoutUser);

// get Current user
router.route("current-user").post(getCurrentUser);

// changePassword
router.route("/change-password").post(changeCurrentPassword);

//resend email verification
router.route("/resend-email-verification").post(resendEmailVerification);

export default router;
