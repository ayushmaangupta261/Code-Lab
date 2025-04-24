import { Router } from "express";
import {
  registerInstitute,
  loginInstitute,
  logoutInstitute,
  editInstituteDetails,
} from "../controllers/institute.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// institute route
router.route("/register-institute").post(registerInstitute);
router.route("/login-institute").post(loginInstitute);
router.route("/logout-institute").post(authMiddleware, logoutInstitute);
router.route("/edit-institute-details").post(authMiddleware, editInstituteDetails);

export default router;
