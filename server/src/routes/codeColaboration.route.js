import { Router } from "express";
import {
  generateFileTree,
  getFiles,
  deleteFile,
  createFile,
  createFolder
} from "../controllers/codeColaboration.controller.js";

const router = Router();

router.route("/getFileTree").get(generateFileTree);
router.route("/getFiles").post(getFiles);
router.route("/deleteFile").delete(deleteFile);
router.route("/createFile").post(createFile);
router.route("/createFolder").post(createFolder);

export default router;
