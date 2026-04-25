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
  generateAccessTokenAndRefreshToken,
  updateAvatar,
  updateCoverImage,
} from "../controllers/auth.controller.js";

import passport from "../config/OAuth.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";
import {
  registerValidator,
  loginValidator,
  userForgotPasswordValidator,
  changeCurrentPasswordValidator,
  resetForgotPasswordValidator,
} from "../validators/auth.validator.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

// Unsecure Routes --> these don't require JWT

// registerUser
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  ...registerValidator(),
  validate,
  registerUser,
);

// loginUser
router.route("/login").post(...loginValidator(), validate, loginUser);

// verifyEmail
router.route("/verify-email/:verificationToken").get(verifyEmail);

// refreshAccessToken
router.route("/refresh-token").post(refreshAccessToken);
// forgotPassword
router.route("/forgot-password").post(forgotPasswordRequest);

// resetFrogotPassword
router.route("/reset-password/:resetToken").post(resetForgotPassword);

// Secure routes --> hit after user is logged in
// router.use(verifyJWT);

// Logout
router.route("/logout").post(verifyJWT, logoutUser);

// get Current user
router.route("/current-user").post(verifyJWT, getCurrentUser);

// changePassword
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

//resend email verification
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

// update avatar
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);

// update coverImage
router
  .route("/update-coverimage")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

// OAuth ROUTES
router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router
  .route("/google/callback")
  .get(
    passport.authenticate("google", { session: false }),
    async (req, res) => {
      // req.user is set by passport (the user from DB)
      const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(req.user?._id);

      // send tokens however you want - cookie or redirect with query params
      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .redirect(`${process.env.CLIENT_URL}/dashboard`);
    },
  );

export default router;
