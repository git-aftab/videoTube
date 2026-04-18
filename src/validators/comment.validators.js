import { body } from "express-validator";

const addCommentValidator = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Comment cannot be EMPTY!")
      .isLength({ max: 500 })
      .withMessage("Comment must be less than 500 characters"),
  ];
};

const updateCommentValidator = () => {
  return [
    body("content")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Comment Cannot be EMPTY!")
      .isLength({ max: 500 })
      .withMessage("Comment must be less than 500 characters"),
  ];
};

export { addCommentValidator, updateCommentValidator };
