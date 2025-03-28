import { Router } from "express";
import {
  authStatus,
  registerUser,
  loginUser,
} from "../controllers/user.controllers.js";

import { createQuestion, getSolvedQuestions } from "../controllers/instructor.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// console.log("Inside user route");

// register the user
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

// login the user
router.route("/login").post(loginUser);

// auth status
router.route("/auth-status").get(authMiddleware, authStatus);


// instructor route
router.route("/post-question").post(authMiddleware, createQuestion); // add middleware
router.route("/get-solved-questions").get(authMiddleware, getSolvedQuestions);


export default router;
