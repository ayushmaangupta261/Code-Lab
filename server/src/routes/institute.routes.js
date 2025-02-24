import { Router } from "express";
import { registerInstitute } from "../controllers/instituteController.js";

const router = Router();

// institute route
router.route("/register-institute").post(registerInstitute);

export default router; 