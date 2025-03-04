import express from "express";
import { getAllAssignments } from "../controllers/assignment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/getAllAssignments").get(authMiddleware, getAllAssignments);
router.route("/auth-status").get(authMiddleware);

export default router;
