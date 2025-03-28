import {Router} from "express";
import { generateFileTree } from "../controllers/codeColaboration.controller.js";

const router = Router();

router.route("/getFiles").get(generateFileTree);

export default router;
