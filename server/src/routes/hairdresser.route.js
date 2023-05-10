import express from "express";
import hairdresserController from "../controllers/hairdresser.controller.js";
import { validateHairdresser } from "../validators/hairdresser.validator.js";

const router = express.Router();

// CREATE
router.post("/", validateHairdresser, hairdresserController.create);

// READ ALL
router.get("/", hairdresserController.readAll)

// UPDATE
router.put("/:id", validateHairdresser, hairdresserController.update )

// DELETE ONE
router.delete("/:id", hairdresserController.deleteOne)

export default router;
