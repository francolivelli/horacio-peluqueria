import { check } from "express-validator";
import validate from "../helpers/request.helper.js";

function validatePasswordFormat(value) {
  let character = "";
  let numbers = 0;
  let upperletters = 0;
  let lowerletters = 0;
  for (let i = 0; i <= value.length - 1; i++) {
    character = value.charAt(i);
    if (!isNaN(character * 1)) {
      numbers++;
    } else {
      if (character === character.toUpperCase()) {
        upperletters++;
      }
      if (character === character.toLowerCase()) {
        lowerletters++;
      }
    }
  }
  if (numbers === 0 || upperletters === 0 || lowerletters === 0) {
    throw new Error(
      "Password must include at least one number, one uppercase letter and one lowercase letter."
    );
  } else {
    return true;
  }
}

// SIGNUP
export const validateSignup = [
  check("email")
    .exists()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("A valid email is required."),
  check("password")
    .exists()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters.")
    .custom(validatePasswordFormat),
  (req, res, next) => {
    validate(req, res, next);
  },
];

// RESET PASSWORD
export const validatePassword = [
  check("newPassword")
    .exists()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters.")
    .custom(validatePasswordFormat),
  (req, res, next) => {
    validate(req, res, next);
  },
];

// UPDATE USER
export const validateUpdate = [
  check("name")
    .exists()
    .withMessage("A name is required.")
    .custom((value, { req }) => {
      const array = value.split(" ");
      if (array.length < 2) {
        throw new Error("Please, include your name and your lastname.");
      } else {
        return true;
      }
    }),
  check("dni")
    .exists()
    .isNumeric()
    .isLength({ min: 8 })
    .withMessage("DNI must have at least 8 digits."),
  check("email")
    .exists()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("A valid email is required."),
  check("phone")
    .optional()
    .custom((value) => {
      if (/\D/.test(value)) {
        throw new Error("Phone number should not include letters.");
      } else {
        return true;
      }
    }),
  (req, res, next) => {
    validate(req, res, next);
  },
];
