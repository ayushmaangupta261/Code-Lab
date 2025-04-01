import { Router } from "express";
import {
  generateFileTree,
  getFiles,
} from "../controllers/codeColaboration.controller.js";

const router = Router();

router.route("/getFileTree").get(generateFileTree);
router.route("/getFiles").post(getFiles);

export default router;
