import { Router } from "express";
import {
  authStatus,
  registerStudent,
  loginStudent,
  logoutStudent,
  getAllCollegesListForStudents,
  editStudentDetails,
} from "../controllers/student.controllers.js";

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
  registerStudent
);

// login the user
router.route("/login").post(loginStudent);
router.route("/logOut").post(authMiddleware, logoutStudent);

// auth status
router.route("/auth-status").get(authMiddleware, authStatus);

// setting routes
router
  .route("/get-all-college-list-for-student")
  .get(authMiddleware, getAllCollegesListForStudents);
router.route("/edit-student-details").post(authMiddleware, editStudentDetails);

export default router;
