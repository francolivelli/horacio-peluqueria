import { check } from "express-validator";
import validate from "../helpers/request.helper.js";

export const validateHairdresser = [
  check("name")
    .exists()
    .withMessage("A name is required."),
  check("schedules")
    .exists()
    .withMessage("Schedules are required.")
    .custom((value, { req }) => {
      const schedulesArray = value.split(",");
      if (schedulesArray.length !== 7) {
        throw new Error("Schedules must have 7 values.");
      }
      return true;
    }),
  (req, res, next) => {
    validate(req, res, next);
  },
];