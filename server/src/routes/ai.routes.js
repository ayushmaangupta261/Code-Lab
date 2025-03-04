import { Router } from "express";
import { myAi } from "../utils/ai/genAi.js";
import { generateTestCases } from "../controllers/ai.controller.js";


const router = Router();

router.route("/ai-message").post(myAi);

router.route("/generate-test-cases").post(generateTestCases);

export default router; 