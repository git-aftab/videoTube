import { body } from "express-validator";

const registerValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLowercase()
      .withMessage("username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("username must have atleast 3 characters"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 }),
  ];
};

const loginValidator = () => {
  return [
    body("email").trim().notEmpty().withMessage("Email is required"),
    body("username").trim().notEmpty().withMessage("username is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

const changeCurrentPasswordValidator = () => {
  return [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old Password is required"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New Password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is Invalid"),
  ];
};

const resetForgotPasswordValidator = () => {
  return [
    body("newPassword").trim().notEmpty().withMessage("Password is required"),
  ];
};

export {
  registerValidator,
  loginValidator,
  changeCurrentPasswordValidator,
  userForgotPasswordValidator,
  resetForgotPasswordValidator,
};
