import { body } from "express-validator";

const addTweetValidator = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Tweet cannot be empty")
      .isLength({ max: 1000 })
      .withMessage("Tweet must be less than 1000 character"),
  ];
};

const updateTweetValidator = () => {
  return [
    body("content")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Tweet cannot be empty")
      .isLength({ max: 1000 })
      .withMessage("Tweet must be less than 1000 characters"),
  ];
};
