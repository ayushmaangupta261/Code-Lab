import { Router } from "express";
import {
  generateFileTree,
  getFiles,
  deleteFile
} from "../controllers/codeColaboration.controller.js";

const router = Router();

router.route("/getFileTree").get(generateFileTree);
router.route("/getFiles").post(getFiles);
router.route("/deleteFile").delete(deleteFile);

export default router;
