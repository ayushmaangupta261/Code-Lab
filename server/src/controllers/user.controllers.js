import { User } from "../models/user.model.js";
import { Institute } from "../models/institute.model.js";
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
const generateUserTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens for User:", error.message);
    throw new Error("Failed to generate tokens for User");
  }
};

// Function to generate tokens for Institutes
const generateInstituteTokens = async (instituteId) => {
  try {
    const institute = await Institute.findById(instituteId);
    if (!institute) {
      throw new Error("Institute not found");
    }

    const accessToken = institute.generateAccessToken();
    const refreshToken = institute.generateRefreshToken();

    institute.refreshToken = refreshToken;
    institute.accessToken = accessToken;
    await institute.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens for Institute:", error.message);
    throw new Error("Failed to generate tokens for Institute");
  }
};

// Main function that calls the correct token generator
const generateAccessAndRefereshTokens = async (userId, role) => {
  if (role === "User") {
    return await generateUserTokens(userId);
  } else if (role === "Institute") {
    return await generateInstituteTokens(userId);
  } else {
    throw new Error("Invalid role specified");
  }
};


// Function to register the user
const registerUser = async (req, res, next) => {
  // console.log("Request body -> ", req.body);

  try {
    // Extract user details
    const { fullName, email, password, accountType } = req.body;

    // Validate required fields
    if (
      [fullName, email, password, accountType].some((field) => !field?.trim())
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
        success: false,
      });
    }

    // Create user in the database
    const user = await User.create({
      fullName,
      email,
      password,
      accountType,
    });

    if (!user) {
      return res
        .status(500)
        .json({ message: "Failed to register user", success: false });
    }

    // Remove sensitive fields
    const createdUser = user.toObject();
    delete createdUser.password;

    setTimeout(() => {
      return res.status(201).json({ user: createdUser, success: true });
    }, 5000);
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred during registration",
      success: false,
    });
  }
};

// Function to login the user
// const loginUser = async (req, res) => {
//   // req body -> data
//   // userName or email
//   //find the user
//   //password check
//   //access and referesh token
//   //send cookie

//   const { email, password, role } = req.body;
//   console.log(email);

//   if (!password && !email && !role) {
//     return res.status(401).json({
//       message: "All credentials are required",
//       success: false,
//     });
//   }

//   if (role === "User") {
//     const user = await User.findOne({
//       email,
//     });
//   }

//   if (!user) {
//     return res.status(401).json({
//       message: "Invalid email, user doesn't exists",
//       success: false,
//     });
//   }

//   console.log("User -> ", user);

//   const isPasswordValid = await user.isPasswordCorrect(password);

//   if (!isPasswordValid) {
//     return res.status(401).json({
//       message: "Invalid password, please check your password",
//       success: false,
//     });
//   }

//   const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
//     user._id
//   );

//   console.log("Tokens -> ", accessToken, " ", refreshToken);

//   const loggedInUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   const userObject = loggedInUser.toObject();

//   // ✅ Attach accessToken to the response
//   userObject.accessToken = accessToken;

//   console.log("Final Response -> ", userObject);

//   const options = {
//     httpOnly: true,
//     secure: false,
//     sameSite: "None",
//   };

//   // return res
//   //   .status(200)
//   //   .cookie("accessToken", accessToken, options)
//   //   .cookie("refreshToken", refreshToken, options)
//   //   .json({
//   //     user: loggedInUser,
//   //     success: true,
//   //   });

//   setTimeout(() => {
//     res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", refreshToken, options)
//       .json({
//         user: userObject,
//         success: true,
//       });
//   }, 5000); // 5 seconds delay
// };

const loginUser = async (req, res) => {
  // Extract credentials from request body
  const { email, password, role } = req.body;
  console.log(email, " ", password, " ", role);

  // Validate input fields
  if (!email || !password || !role) {
    return res.status(401).json({
      message: "All credentials are required",
      success: false,
    });
  }

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "None",
  };

  if (role === "User") {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          message: "Invalid email, user doesn't exist",
          success: false,
        });
      }

      console.log("User -> ", user);

      const isPasswordValid = await user.isPasswordCorrect(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid password, please check your password",
          success: false,
        });
      }

      const { accessToken, refreshToken } =
        await generateAccessAndRefereshTokens(user._id, role);

      console.log("Tokens -> ", accessToken, " ", refreshToken);

      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      const userObject = loggedInUser.toObject();
      userObject.accessToken = accessToken;

      console.log("Final Response -> ", userObject);

      setTimeout(() => {
        res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json({
            user: userObject,
            success: true,
          });
      }, 5000);
    } catch (error) {
      console.error("Error in User Login:", error);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  } else if (role === "Institute") {
    try {
      const institute = await Institute.findOne({ email });

      if (!institute) {
        return res.status(401).json({
          message: "Invalid email, institute doesn't exist",
          success: false,
        });
      }

      console.log("Institute -> ", institute);

      const isPasswordValid = await institute.isPasswordCorrect(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid password, please check your password",
          success: false,
        });
      }

      const { accessToken, refreshToken } =
        await generateAccessAndRefereshTokens(institute._id, role);

      console.log("Tokens -> ", accessToken, " ", refreshToken);

      const loggedInInstitute = await Institute.findById(institute._id).select(
        "-password -refreshToken"
      );

      const instituteObject = loggedInInstitute.toObject();
      instituteObject.accessToken = accessToken;

      console.log("Final Response -> ", instituteObject);

      setTimeout(() => {
        res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json({
            user: instituteObject,
            success: true,
          });
      }, 5000);
    } catch (error) {
      console.error("Error in Institute Login:", error);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  } else {
    return res.status(400).json({ message: "Invalid role", success: false });
  }
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

export { registerUser, loginUser, authStatus };
