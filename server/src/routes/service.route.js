import express from "express";
import serviceController from "../controllers/service.controller.js";
import { validateService } from "../validators/service.validator.js";

const router = express.Router();

// CREATE
router.post("/", validateService, serviceController.create);

// READ ALL
router.get("/", serviceController.readAll)

// UPDATE
router.put("/:id", validateService, serviceController.update )

// DELETE ONE
router.delete("/:id", serviceController.deleteOne)

export default router;
