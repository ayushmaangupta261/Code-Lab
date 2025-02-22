import express from "express";
import { compileCode } from "../controllers/compiler.controller.js";

const router = express.Router();

router.post("/compile", compileCode);

export default router;
