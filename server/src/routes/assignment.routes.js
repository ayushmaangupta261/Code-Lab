import express from "express";
import {
  getAllAssignments,
  submitAssignment,
  completedAssignments
} from "../controllers/assignment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/get-all-assignments").get(authMiddleware, getAllAssignments);
router.route("/submit-assignments").post(authMiddleware, submitAssignment);
router.route("/completed-assignments").get(authMiddleware, completedAssignments);

router.route("/auth-status").get(authMiddleware);

export default router;
