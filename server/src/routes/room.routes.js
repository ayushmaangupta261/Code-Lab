import { Router } from "express";
import { createAndJoinRoom,findRoomByEmail } from "../controllers/room.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-and-join-room").post(authMiddleware, createAndJoinRoom);
router.route("/find-room-by-email").post(authMiddleware, findRoomByEmail);

export default router;
