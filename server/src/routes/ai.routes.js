import { Router } from "express";
import { myAi } from "../utils/ai/genAi.js";

const router = Router();

router.route("/ai-message").post(myAi);

export default router; 