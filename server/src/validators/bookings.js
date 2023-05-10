// import { check } from "express-validator";
// import validate from "../helpers/request.helper.js";

// // BOOK
// export const validateBooking = [
//   check("name").isString().withMessage("Name is required"),
//   check("email")
//     .isEmail()
//     .withMessage("A valid email is required"),
//   check("phone")
//     .isNumeric()
//     .withMessage("Phone number must be numeric")
//     .isLength({ min: 10, max: 10 })
//     .withMessage("Phone number should have 10 digits"),
//   check("branch")
//     .exists()
//     .withMessage("Branch ID is required"),
//     check("date")
//     .exists()
//     .withMessage("Date is required")
//     .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)
//     .withMessage("Invalid date format (dd/mm/yyyy)"),
//   check("time")
//     .isString()
//     .withMessage("Booking time is required")
//     .matches(/^(0[7-9]|1[0-9]):[0-5][0-9]$/)
//     .withMessage("Invalid booking time format (HH:mm)"),
//   (req, res, next) => {
//     validate(req, res, next);
//   },
// ];