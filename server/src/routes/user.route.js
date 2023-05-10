import express from "express";
import userController from "../controllers/user.controller.js";
import {
  validateSignup,
  validatePassword,
} from "../validators/user.validator.js";

const router = express.Router();

// SIGNUP
router.post("/signup", validateSignup, userController.signup);

// SIGNIN
router.post("/signin", validateSignup, userController.signin);

// SIGNOUT
router.post("/signout", userController.signout);

//FORGOT PASSWORD
router.post("/forgot-password", userController.forgotPassword);

// FIND USER BY EMAIL
router.get("/:email", userController.findUserByEmail);

//VERIFY TOKEN
router.get("/verifyToken/:token", userController.verifyToken);

// RESET PASSWORD
router.post("/reset-password", validatePassword, userController.resetPassword);

// CHANGE PASSWORD
router.post("/change-password", userController.changePassword);

export default router;
