import { Student } from "../models/user.model.js";
import { Institute } from "../models/institute.model.js";
import { Instructor } from "../models/instructor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Function to generate access and refresh token
// const generateAccessAndRefereshTokens = async (userId, role) => {
//   try {
//     const user = await User.findById(userId);
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();

//     user.refreshToken = refreshToken;
//     user.accessToken = accessToken;
//     await user.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw new Error(
//       500,
//       "Something went wrong while generating referesh and access token"
//     );
//   }
// };

// Function to generate tokens for Users
// Generate tokens for Student
// const generateStudentTokens = async (studentId) => {
//   try {
//     const student = await Student.findById(studentId);
//     if (!student) {
//       throw new Error("Student not found");
//     }

//     const accessToken = student.generateAccessToken();
//     const refreshToken = student.generateRefreshToken();

//     student.accessToken = accessToken;
//     student.refreshToken = refreshToken;
//     await student.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     console.error("Error generating tokens for Student:", error.message);
//     throw new Error("Failed to generate tokens for Student");
//   }
// };

// // Generate tokens for Instructor
// const generateInstructorTokens = async (instructorId) => {
//   try {
//     const instructor = await Instructor.findById(instructorId);
//     if (!instructor) {
//       throw new Error("Instructor not found");
//     }

//     const accessToken = instructor.generateAccessToken();
//     const refreshToken = instructor.generateRefreshToken();

//     instructor.accessToken = accessToken;
//     instructor.refreshToken = refreshToken;
//     await instructor.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     console.error("Error generating tokens for Instructor:", error.message);
//     throw new Error("Failed to generate tokens for Instructor");
//   }
// };

// // Generate tokens for Institute
// const generateInstituteTokens = async (instituteId) => {
//   try {
//     const institute = await Institute.findById(instituteId);
//     if (!institute) {
//       throw new Error("Institute not found");
//     }

//     const accessToken = institute.generateAccessToken();
//     const refreshToken = institute.generateRefreshToken();

//     institute.accessToken = accessToken;
//     institute.refreshToken = refreshToken;
//     await institute.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     console.error("Error generating tokens for Institute:", error.message);
//     throw new Error("Failed to generate tokens for Institute");
//   }
// };

// // Dispatcher
// const generateAccessAndRefereshTokens = async (userId, role) => {
//   if (role === "Student") {
//     return await generateStudentTokens(userId);
//   } else if (role === "Instructor") {
//     return await generateInstructorTokens(userId);
//   } else if (role === "Institute") {
//     return await generateInstituteTokens(userId);
//   } else {
//     throw new Error("Invalid role specified");
//   }
// };

// // Function to register the user
// const registerUser = async (req, res) => {
//   try {
//     const { fullName, email, password, accountType } = req.body;

//     console.log("Req body -> ", req.body);

//     if (
//       [fullName, email, password, accountType].some((field) => !field?.trim())
//     ) {
//       return res.status(400).json({
//         message: "All fields are required",
//         success: false,
//       });
//     }

//     const options = {
//       httpOnly: true,
//       secure: false,
//       sameSite: "None",
//     };

//     let existingUser, Model;

//     if (accountType === "Student") {
//       existingUser = await Student.findOne({ email });
//       Model = Student;
//     } else if (accountType === "Instructor") {
//       existingUser = await Instructor.findOne({ email });
//       Model = Instructor;
//     } else {
//       return res.status(400).json({
//         message:
//           "Invalid account type. Only Student and Instructor are allowed.",
//         success: false,
//       });
//     }

//     if (existingUser) {
//       return res.status(409).json({
//         message: `${accountType} with this email already exists`,
//         success: false,
//       });
//     }

//     const newUser = await Model.create({
//       fullName,
//       email,
//       password,
//       accountType,
//     });

//     if (!newUser) {
//       return res.status(500).json({
//         message: "Failed to register user",
//         success: false,
//       });
//     }

//     const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
//       newUser._id,
//       accountType
//     );

//     const createdUser = await Model.findById(newUser._id).select(
//       "-password -refreshToken"
//     );

//     const userObject = createdUser.toObject();
//     userObject.accessToken = accessToken;

//     setTimeout(() => {
//       res
//         .status(201)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json({
//           user: userObject,
//           success: true,
//         });
//     }, 5000);
//   } catch (error) {
//     console.error("Error in registerUser:", error);
//     return res.status(error.statusCode || 500).json({
//       message: error.message || "An error occurred during registration",
//       success: false,
//     });
//   }
// };

// // Function to login the user
// const loginUser = async (req, res) => {
//   const { email, password, role } = req.body;

//   console.log("Data -> ", req.body);

//   if (!email || !password || !role) {
//     return res.status(401).json({
//       message: "All credentials are required",
//       success: false,
//     });
//   }

//   const options = {
//     httpOnly: true,
//     secure: false,
//     sameSite: "None",
//   };

//   try {
//     let model, userType;

//     if (role === "Institute") {
//       model = Institute;
//       userType = "institute";
//     } else if (role === "Student") {
//       model = Student;
//       userType = "student";
//     } else if (role === "Instructor") {
//       model = Instructor;
//       userType = "instructor";
//     } else {
//       return res.status(400).json({ message: "Invalid role", success: false });
//     }

//     const user = await model.findOne({ email });

//     if (!user) {
//       return res.status(401).json({
//         message: `Invalid email, ${userType} doesn't exist`,
//         success: false,
//       });
//     }

//     const isPasswordValid = await user.isPasswordCorrect(password);

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         message: "Invalid password, please check your password",
//         success: false,
//       });
//     }

//     const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
//       user._id,
//       role
//     );

//     const loggedInUser = await model
//       .findById(user._id)
//       .select("-password -refreshToken");

//     const userObject = loggedInUser.toObject();
//     userObject.accessToken = accessToken;

//     setTimeout(() => {
//       res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json({
//           user: userObject,
//           success: true,
//         });
//     }, 5000);
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Internal server error", success: false });
//   }
// };

// //function to logout the user
// const logOutUser = async (req, res) => {
//   try {
//     const user = req?.user;

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User already Logged Out",
//       });
//     }

//     console.log("user to logout -> ", user);

//     const loggedInUser = await User.findById({ _id: user._id });

//     if (!loggedInUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already Logged Out",
//       });
//     }

//     if (
//       loggedInUser.accessToken === null ||
//       loggedInUser.accessToken !== user.accessToken
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "User already Logged Out",
//       });
//     }

//     loggedInUser.accessToken = null;
//     loggedInUser.refreshToken = null;
//     await loggedInUser.save();

//     return res.status(200).json({
//       success: true,
//       message: "User Logged Out successfully",
//     });
//   } catch (error) {
//     console.log("User logout error -> ", error);
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// Token generator
const generateStudentTokens = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error("Student not found");

  const accessToken = student.generateAccessToken();
  const refreshToken = student.generateRefreshToken();

  student.accessToken = accessToken;
  student.refreshToken = refreshToken;
  await student.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// Register
const registerStudent = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  const existing = await Student.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: "Student already exists" });
  }

  const student = await Student.create({
    fullName,
    email,
    password,
    accountType: "Student",
  });
  const { accessToken, refreshToken } = await generateStudentTokens(
    student._id
  );

  const studentData = student.toObject();
  delete studentData.password;
  delete studentData.refreshToken;
  studentData.accessToken = accessToken;

  await new Promise((resolve) => setTimeout(resolve, 5000));

  res
    .status(201)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    })
    .json({ success: true, user: studentData });
};

// Login
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email })
    .populate({
      path: "questionsSolved",
      select: "title description",
    }) // Full questions data
    .populate({
      path: "collegeId",
      select: "name email studentsEnrolled",
    })
    .populate({
      path: "instructor",
      select: "fullName email mobileNumber subject",
    });

  if (!student || !(await student.isPasswordCorrect(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = await generateStudentTokens(
    student._id
  );

  const studentData = student.toObject();
  delete studentData.password;
  delete studentData.refreshToken;
  studentData.accessToken = accessToken;

  await new Promise((resolve) => setTimeout(resolve, 5000));

  res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    })
    .json({ success: true, user: studentData });
};

// Logout
const logoutStudent = async (req, res) => {
  const student = await Student.findById(req.user._id);
  if (!student)
    return res
      .status(400)
      .json({ success: false, message: "Already logged out" });

  student.accessToken = null;
  student.refreshToken = null;
  await student.save();

  res
    .status(200)
    .json({ success: true, message: "Student logged out successfully" });
};

// function to check auth status
const authStatus = async (req, res) => {
  try {
    const { user } = req;
    // console.log("User -> ,", user);

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User is not loggedin",
      });
    }

    const userInDB = await User.findById(user._id);

    if (!userInDB) {
      return res.status(400).json({
        status: false,
        message: "User doesn't exist",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User Authenticated",
    });
  } catch (error) {
    console.log("Error in auth status ->", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// get all colleges
const getAllCollegesListForStudents = async (req, res) => {
  try {
    const user = req.user;
    console.log("Fetching colleges");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Get all colleges and populate instructors
    const collegeList = await Institute.find()
      .select("name email subjects instructorsPresent") // select required fields
      .populate({
        path: "instructorsPresent",
        select: "fullName email subject", // populate only necessary instructor fields
      });

    if (!collegeList || collegeList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No colleges found",
      });
    }

    return res.status(200).json({
      success: true,
      data: collegeList,
    });
  } catch (error) {
    console.log("Error in finding college list -> ", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// edit details
const editStudentDetails = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body.data;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    const { college, teacher, subject, mobileNumber } = data;

    if (!college || !teacher || !subject || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide college, teacher, subject, and mobile number",
      });
    }

    const existingStudent = await Student.findById(user._id);

    // Fetch current student data
    // If college or subject or teacher has changed, remove student from previous associations
    if (existingStudent.collegeId?.toString() !== college) {
      // Remove student from previous college
      await Institute.updateMany(
        { studentsEnrolled: existingStudent._id },
        { $pull: { studentsEnrolled: existingStudent._id } }
      );
    }

    if (existingStudent.instructor?.toString() !== teacher) {
      // Remove student from previous instructor
      await Instructor.updateMany(
        { students: existingStudent._id },
        { $pull: { students: existingStudent._id } }
      );
    }

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Remove student from previous instructor (if changed)
    if (existingStudent.instructor?.toString() !== teacher) {
      await Instructor.updateMany(
        { students: existingStudent._id },
        { $pull: { students: existingStudent._id } }
      );
    }

    // Remove student from previous college (if changed)
    if (existingStudent.collegeId?.toString() !== college) {
      await Institute.updateMany(
        { studentsEnrolled: existingStudent._id },
        { $pull: { studentsEnrolled: existingStudent._id } }
      );
    }

    // Update student document
    const updatedStudent = await Student.findByIdAndUpdate(
      user._id,
      {
        collegeId: college,
        instructor: teacher,
        subject,
        mobileNumber,
      },
      { new: true }
    );

    // Add to new instructor
    await Instructor.findByIdAndUpdate(
      teacher,
      { $addToSet: { students: updatedStudent._id } },
      { new: true }
    );

    // Add to new institute
    await Institute.findByIdAndUpdate(
      college,
      { $addToSet: { studentsEnrolled: updatedStudent._id } },
      { new: true }
    );

    // Populate instructor and college in final response
    const populatedStudent = await Student.findById(
      updatedStudent._id
    ).populate("collegeId instructor");

    return res.status(200).json({
      success: true,
      message: "Student details updated successfully",
      data: populatedStudent,
    });
  } catch (error) {
    console.error("Error updating student details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export {
  registerStudent,
  loginStudent,
  authStatus,
  logoutStudent,
  getAllCollegesListForStudents,
  editStudentDetails,
};
