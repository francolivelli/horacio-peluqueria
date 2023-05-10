import express from "express";
import usersRoutes from "./user.route.js";
// import bookingsRoutes from "./bookings.js";
import hairdressersRoutes from "./hairdresser.route.js";

const router = express.Router();

router.use("/users", usersRoutes);
// router.use("/bookings", bookingsRoutes);
router.use("/hairdressers", hairdressersRoutes);

export default router;
